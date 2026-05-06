import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Printer, FileText, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { convertImageToHtml } from './lib/gemini';

interface DocumentPage {
  id: string;
  imageDataUrl: string;
  mimeType: string;
  status: 'loading' | 'complete' | 'error';
  html: string;
  error?: string;
}

const htmlPage1 = `<div dir="rtl" style="font-family: 'Times New Roman', Times, serif; color: black; max-width: 100%; margin: 0 auto; box-sizing: border-box; border: 2px solid #edaf81; padding: 10px;">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #edaf81; padding-bottom: 5px; margin-bottom: 10px; font-weight: bold; font-size: 1.1rem;">
    <div>السنة الثانية</div>
    <div style="color: red; font-size: 1.3rem;">المركبة 01 : الحوار</div>
    <div>الميدان الأول</div>
  </div>

  <!-- Box 1 -->
  <div style="background: linear-gradient(to bottom, #eff6fb, #ebf5fa); border: 2px solid #b0d0e8; border-radius: 10px; padding: 10px; margin-bottom: 10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.1) inset;">
    <p style="margin: 0; line-height: 1.5;"><span style="color: red; font-weight: bold;">الكفاءة الشاملة :</span> في نهاية السنة الثانية من التعليم المتوسط يكون المتعلم قادرا على ممارسة حرية التعبير والحوار كأسلوب حضاري أساسي في الحياة الإجتماعية لحل المشاكل داخل الأطر النظامية.</p>
  </div>

  <!-- Box 2 -->
  <div style="background-color: #bfd66c; border: 2px solid #a8c050; border-radius: 10px; padding: 10px; margin-bottom: 10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.1) inset;">
    <p style="margin: 0; font-weight: bold;"><span style="color: red;">الكفاءة الختامية للميدان :</span> يمارس الحوار البناء بإعتباره سلوكا حضاريا وأساسيا في الحياة الجماعية</p>
  </div>

  <!-- Box 3 -->
  <div style="background: linear-gradient(to bottom, #f3ebf3, #ece0eb); border: 2px solid #c8b0c8; border-radius: 10px; padding: 10px; margin-bottom: 10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.1) inset;">
    <p style="margin: 0; line-height: 1.5;"><span style="color: red; font-weight: bold;">الوضعية المشكلة الإنطلاقية الأم :</span> أثناء تصفحك لجريدة وطنية شد انتباه زميلك العبارة التالية: الجمعيات من مكونات المجتمع المدني ومن خلالها يتم تعلم الحوار البناء كأسلوب حضاري لحل المشكلات فطلب منك أن تظهر له أهمية الحوار وآدابه ، ودور الجمعيات في تطويره ترقية للمجتمع والمواطن..</p>
  </div>

  <!-- Box 4 -->
  <div style="background: linear-gradient(to bottom, #eff9de, #eaf5d5); border: 2px solid #c0d8a0; border-radius: 10px; padding: 10px; margin-bottom: 10px; box-shadow: 2px 2px 4px rgba(0,0,0,0.1) inset;">
    <p style="margin: 0; line-height: 1.5; font-weight: bold;"><span style="color: red;">الوضعية المشكلة الجزئية :</span> في حوار تلفزيوني قال أحدهم أن الناس يلجأون للحوار لحل مشاكلهم وهم مجبرون على الإلتزام بآدابه, حينها طلبت أختك شرحا لذلك. ؟</p>
  </div>

  <!-- Table -->
  <table style="width: 100%; border-collapse: collapse; border: 2px solid black; text-align: right; line-height: 1.5; background: white;">
    <thead>
      <tr>
        <th style="border: 1px solid black; padding: 8px; width: 25%; text-align: center; border-bottom: 2px solid black;">السندات و التعليمات</th>
        <th style="border: 1px solid black; padding: 8px; width: 55%; text-align: center; border-bottom: 2px solid black;">المنتوج الإنتقائي ( الأثر الكتابي )</th>
        <th style="border: 1px solid black; padding: 8px; width: 20%; text-align: center; border-bottom: 2px solid black;">مؤشر الكفاءة</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="font-weight: bold;">التعليمة 1 :</span> إنطلاقا من السند 11 عرف الحوار
        </td>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="color: red; font-weight: bold;">1 / مفهوم الحوار :</span> هو عملية تبادل الحديث بين الأفراد والمجتمعات من أجل التفاهم وتبادل المعرفة. وهو عملية ضرورية لإستمرار الحياة
        </td>
        <td style="border: 1px solid black; padding: 8px; text-align: center; vertical-align: middle;">يعرف الحوار</td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="font-weight: bold;">التعليمة 2 :</span> إنطلاقا من السندات 13 إستنتج أهداف الحوار و أهميته
        </td>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="color: red; font-weight: bold;">2 / أهميته و أهدافه :</span>
          <ul style="list-style-type: none; padding: 0; margin: 5px 0 0 0;">
            <li style="margin-bottom: 5px;">- حل المشاكل والتخفيف من حدة المشاكل</li>
            <li style="margin-bottom: 5px;">- فرصة للتواصل والتعبير الحر عن الأراء</li>
            <li style="margin-bottom: 5px;">- تبادل المعلومات والوصول لأفكار جديدة</li>
            <li>- تجنب العنف وإكتشاف الأخطاء</li>
          </ul>
        </td>
        <td style="border: 1px solid black; padding: 8px; text-align: center; vertical-align: middle;">يستنتج أهداف الحوار و أهميته</td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="font-weight: bold;">التعليمة 3 :</span> إعتمادا على السند 2 ص 14,15 أذكر شروط الحوار
        </td>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="color: red; font-weight: bold;">3 / شروطه :</span>
          <ul style="list-style-type: none; padding: 0; margin: 5px 0 0 0;">
            <li style="margin-bottom: 5px;">- تحديد موضوع للحوار</li>
            <li style="margin-bottom: 5px;">- إحترام الرأي الأخر</li>
            <li style="margin-bottom: 5px;">- إستعمال لغة مهذبة</li>
            <li>- عدم التجريح والإبتعاد عن التميز</li>
          </ul>
        </td>
        <td style="border: 1px solid black; padding: 8px; text-align: center; vertical-align: middle;">يذكر شروط الحوار</td>
      </tr>
      <tr>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="font-weight: bold;">التعليمة 4 :</span> إعتمادا على السندات ص 15 عدد مستويات الحوار
        </td>
        <td style="border: 1px solid black; padding: 8px; vertical-align: top;">
          <span style="color: red; font-weight: bold;">4 / مستوياته :</span> ويتم في مستويات عدة نذكر منها : المدرسة. القسم. الأسرة. الإعلام , وكذا على المستوى الوطني والعالمي
        </td>
        <td style="border: 1px solid black; padding: 8px; text-align: center; vertical-align: middle;">عدد مستويات الحوار</td>
      </tr>
    </tbody>
  </table>
  <div style="text-align: center; margin-top: 15px; font-size: 0.9rem; position: relative;">
     <svg width="40" height="40" viewBox="0 0 100 100" style="position: absolute; left: 50%; transform: translateX(-50%); top: -15px; z-index: -1;">
        <path fill="none" stroke="#ccc" stroke-width="2" d="M50 5 L55 15 L65 10 L65 20 L77 20 L72 30 L82 35 L75 42 L85 50 L75 58 L82 65 L72 70 L77 80 L65 80 L65 90 L55 85 L50 95 L45 85 L35 90 L35 80 L23 80 L28 70 L18 65 L25 58 L15 50 L25 42 L18 35 L28 30 L23 20 L35 20 L35 10 L45 15 Z"/>
     </svg>
     <span style="position: relative; z-index: 1;">67</span>
  </div>
</div>`;

const htmlPage2 = `<div dir="rtl" style="font-family: 'Times New Roman', Times, serif; color: black; max-width: 100%; margin: 0 auto; box-sizing: border-box; border: 1px solid #a6a6a6; padding: 20px; background: white;">
  <h1 style="color: red; text-align: center; font-size: 1.6rem; font-weight: bold; margin-bottom: 15px;">المخطط السنوي لسير التعلمات تاريخ السنة الثانية</h1>

  <table style="width: 100%; border-collapse: collapse; border: 1px solid #a6a6a6; text-align: center; line-height: 1.4; font-size: 1.1rem;">
    <thead>
      <tr>
        <th style="border: 1px solid #a6a6a6; padding: 5px; width: 8%; color: red;">أسابيع</th>
        <th style="border: 1px solid #a6a6a6; padding: 5px; width: 10%; color: red;">المقطع</th>
        <th style="border: 1px solid #a6a6a6; padding: 5px; width: 35%; color: red;">المركبات</th>
        <th style="border: 1px solid #a6a6a6; padding: 5px; width: 47%; color: red;">سير التعلمات</th>
      </tr>
    </thead>
    <tbody>
      <!-- Group 1 -->
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">3</td>
        <td rowspan="7" style="border: 1px solid #a6a6a6; padding: 10px; background-color: #fce4d6;">
           <div style="writing-mode: vertical-rl; transform: rotate(180deg); margin: auto; font-weight: bold;">المقطع الأول:الوثائق التاريخية ( 06 ساعات)</div>
        </td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">تقويم تشخيصي</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">4</td>
        <td rowspan="2" style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">الخطوات المنهجية لدراسة الوثيقة التاريخية</td>
        <td rowspan="2" style="border: 1px solid #a6a6a6; padding: 5px;">وضعية إنطلاق - تعريف الوثيقة<br>التاريخية - خطوات دراستها</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">5</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">6</td>
        <td rowspan="2" style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">ميادين تحول المجتمع الإسلامي</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">- دراسة صحيفة المدينة</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">7</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">دولة الرسول ( ص ) في المدينة</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">8</td>
        <td rowspan="2" style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">التطور الحضاري للدولة الإسلامية</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">التطور السياسي-التطور الإقتصادي</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">9</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">التطور الثقافي – التطور العسكري</td>
      </tr>

      <!-- Group 2 -->
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">10</td>
        <td rowspan="9" style="border: 1px solid #a6a6a6; padding: 10px; background-color: #e2efda;">
           <div style="writing-mode: vertical-rl; transform: rotate(180deg); margin: auto; font-weight: bold;">المقطع الثاني : التاريخ الوطني ( 14 ساعة )</div>
        </td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">إدماج كلي</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">11</td>
        <td rowspan="2" style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">تحول شمال إفريقيا إلى المغرب الإسلامي</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">وضعية إنطلاق - موقع بلاد المغرب<br>- مراحل الفتح الإسلامي</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">12</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">- نتائج الفتح الإسلامي لبلاد المغرب<br>- فتح الاندلس</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">13</td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">تقويم فصلي</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">14</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">الدول الإسلامية في الجزائروالمغرب الإسلامي</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">الدولة الأغلبية - الدولة الرستمية -<br>الدولة الإدريسية</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px;"></td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">إستراحة بيداغوجية</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">15</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">الدول الإسلامية في الجزائروالمغرب الإسلامي</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">- الدولة المرابطية - الدولة الموحدية</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">16</td>
        <td rowspan="2" style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">إنعكاسات تراجع السيادة على الأندلس</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">المغرب الإسلامي ما بعد الموحدين</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">17</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">- نتائج سقوط الأندلس</td>
      </tr>

      <!-- Group 3 -->
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">18</td>
        <td rowspan="6" style="border: 1px solid #a6a6a6; padding: 10px; background-color: #00b0f0;">
           <div style="writing-mode: vertical-rl; transform: rotate(180deg); margin: auto; font-weight: bold;">المقطع الثالث : التاريخ العام( 06 ساعات)</div>
        </td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">إدماج كلي</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">19</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">الفتوحات الإسلامية في الشرق و الغرب</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">الإمتداد الزماني - الإمتداد المكاني</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">20</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">مظاهر الحضارة الإسلامية</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">المشرق – المغرب - الأندلس</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px;"></td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">إستراحة بيداغوجية</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">21</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px; font-weight: bold;">مظاهر تأثير الحضارة الإسلامية</td>
        <td style="border: 1px solid #a6a6a6; padding: 5px;">المظهر العمراني – المظهر الفني</td>
      </tr>
      <tr>
        <td style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">22</td>
        <td colspan="2" style="border: 1px solid #a6a6a6; padding: 5px; color: red; font-weight: bold;">إدماج كلي</td>
      </tr>
    </tbody>
  </table>

  <!-- Footer Graphic -->
  <div style="text-align: center; margin-top: 15px; font-size: 0.9rem; position: relative;">
     <svg width="40" height="40" viewBox="0 0 100 100" style="position: absolute; left: 50%; transform: translateX(-50%); top: -15px; z-index: -1;">
        <path fill="none" stroke="#ccc" stroke-width="2" d="M50 5 L55 15 L65 10 L65 20 L77 20 L72 30 L82 35 L75 42 L85 50 L75 58 L82 65 L72 70 L77 80 L65 80 L65 90 L55 85 L50 95 L45 85 L35 90 L35 80 L23 80 L28 70 L18 65 L25 58 L15 50 L25 42 L18 35 L28 30 L23 20 L35 20 L35 10 L45 15 Z"/>
     </svg>
     <span style="position: relative; z-index: 1;">3</span>
  </div>
</div>`;

export default function App() {
  const [pages, setPages] = useState<DocumentPage[]>([
    {
      id: 'demo-arabic-page-1',
      imageDataUrl: '',
      mimeType: 'image/jpeg',
      status: 'complete',
      html: htmlPage1
    },
    {
      id: 'demo-arabic-page-2',
      imageDataUrl: '',
      mimeType: 'image/jpeg',
      status: 'complete',
      html: htmlPage2
    }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const id = Math.random().toString(36).substring(7);
    
    // Read the file as a data URL for both display and processing
    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      
      const newPage: DocumentPage = {
        id,
        imageDataUrl: dataUrl,
        mimeType: file.type,
        status: 'loading',
        html: ''
      };

      setPages(prev => [...prev, newPage]);

      try {
        const htmlContent = await convertImageToHtml(dataUrl, file.type);
        setPages(prev => prev.map(p => 
          p.id === id ? { ...p, status: 'complete', html: htmlContent } : p
        ));
      } catch (error) {
        setPages(prev => prev.map(p => 
          p.id === id ? { ...p, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' } : p
        ));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(processFile);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  }, []);

  const handleDelete = (id: string) => {
    setPages(prev => prev.filter(p => p.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Configuration & Controls - Hidden during print */}
      <div className="no-print sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-inner">
                <FileText size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 tracking-tight">DocuPrint AI</h1>
                <p className="text-xs text-gray-500 font-medium">Image to Printable A4</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
              >
                <div className="mr-2 border border-blue-300 rounded bg-white p-0.5">
                  <UploadCloud size={16} />
                </div>
                Add Image(s)
              </button>
              
              <button
                onClick={handlePrint}
                disabled={pages.length === 0 || pages.some(p => p.status === 'loading')}
                className="flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm disabled:shadow-none"
              >
                <Printer size={18} className="mr-2" />
                Print to PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:max-w-none">
        
        {pages.length === 0 ? (
          <div 
            className={`no-print border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 transition-all min-h-[60vh] max-w-3xl mx-auto
              ${isDragging ? 'border-blue-500 bg-blue-50 relative top-[-4px] shadow-lg xl:scale-[1.02]' : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-gray-50'}
            `}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-blue-50">
              <ImageIcon size={40} />
            </div>
            <h3 className="mt-2 text-2xl font-bold text-gray-900 tracking-tight">Upload document images</h3>
            <p className="mt-3 text-sm text-gray-500 max-w-md text-center leading-relaxed">
              Drag and drop an image of a document (PNG, JPG) here, or click to browse. We will use AI to recreate it as text and tables, perfectly sized for A4 printing.
            </p>
          </div>
        ) : (
          <div className="space-y-12 print:space-y-0 print:m-0 print:p-0">
            {pages.map((page, index) => (
              <div key={page.id} className="relative group print:m-0 print:p-0">
                <div className="no-print flex justify-between items-center mb-3">
                  <h2 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Page {index + 1}</h2>
                  <button 
                    onClick={() => handleDelete(page.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Remove page"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="a4-page mx-auto bg-white border border-gray-200">
                  {page.status === 'loading' ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                      <div className="p-8 bg-white rounded-2xl shadow-xl flex flex-col items-center text-center max-w-sm border border-gray-100">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full blur-md bg-blue-400/50 animate-pulse"></div>
                          <Loader2 className="animate-spin text-blue-600 relative z-10" size={48} />
                        </div>
                        <h3 className="mt-6 text-lg font-bold text-gray-900">Converting Document</h3>
                        <p className="mt-2 text-sm text-gray-500">Extracting text, formatting tables, and reconstructing layout...</p>
                      </div>
                    </div>
                  ) : page.status === 'error' ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 bg-red-50/50">
                      <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm max-w-md text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText size={24} />
                        </div>
                        <h3 className="text-red-800 font-semibold mb-2">Conversion Failed</h3>
                        <p className="text-sm text-red-600 mb-4">{page.error}</p>
                        <button 
                          onClick={() => handleDelete(page.id)}
                          className="px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition"
                        >
                          Remove Page
                        </button>
                      </div>
                      {/* Show original image dimmed in background so they can see what failed */}
                      <img src={page.imageDataUrl} alt="Failed document" className="absolute object-contain opacity-10 blur-sm pointer-events-none w-[80%] h-[80%]" />
                    </div>
                  ) : null}

                  {page.status === 'complete' && page.html ? (
                    <div 
                      className="w-full h-full text-black print:text-black"
                      dangerouslySetInnerHTML={{ __html: page.html }} 
                    />
                  ) : (
                    // Also show image when loading, behind the loader
                    page.status === 'loading' && (
                      <div className="opacity-20 blur-sm flex justify-center items-center h-full">
                         <img src={page.imageDataUrl} alt="Document loading" className="max-w-full max-h-full object-contain" />
                      </div>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

