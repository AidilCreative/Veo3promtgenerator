
import React, { useState, useCallback } from 'react';
import { PromptFormState, CameraMovementOption } from './types';
import { ASPECT_RATIOS, INITIAL_FORM_STATE, CAMERA_MOVEMENTS } from './constants';
import FormField from './components/FormField';
import TextInput from './components/TextInput';
import TextAreaInput from './components/TextAreaInput';
import SelectInput from './components/SelectInput';
import ClipboardIcon from './components/icons/ClipboardIcon';
import ResetIcon from './components/icons/ResetIcon';

const App: React.FC = () => {
  const [formState, setFormState] = useState<PromptFormState>(INITIAL_FORM_STATE);
  const [editableIndonesianPrompt, setEditableIndonesianPrompt] = useState<string>('');
  const [finalEnglishPrompt, setFinalEnglishPrompt] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState<string>('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleIndonesianPromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableIndonesianPrompt(e.target.value);
  }, []);

  const generatePrompt = useCallback(() => {
    const {
      sceneTitle,
      characterCoreDescription,
      characterVoiceDetails,
      characterAction,
      characterExpression,
      sceneLocationTime,
      additionalVisualDetails,
      cameraMovement: cameraMovementValue,
      overallAtmosphere,
      environmentalSounds,
      characterDialog,
      aspectRatio,
      negativePrompt,
    } = formState;

    // --- Generate Developed Indonesian Prompt ---
    let idPromptParts: string[] = [];
    if (sceneTitle) idPromptParts.push(`Judul Scene: ${sceneTitle}\nDeskripsi: Adegan ini berpusat pada sebuah skenario berjudul "${sceneTitle}".`);
    if (characterCoreDescription) idPromptParts.push(`Deskripsi Karakter Inti: Karakter utama adalah ${characterCoreDescription}`);
    if (characterVoiceDetails) idPromptParts.push(`Detail Suara Karakter: ${characterVoiceDetails}\nPENTING: Seluruh dialog harus dalam Bahasa Indonesia dengan pengucapan natural dan jelas. Pastikan suara karakter ini konsisten di seluruh video.`);
    if (characterAction) idPromptParts.push(`Aksi Karakter: Karakter terlihat melakukan ${characterAction}.`);
    if (characterExpression) idPromptParts.push(`Ekspresi Karakter: Ekspresi yang ditunjukkan oleh karakter adalah ${characterExpression}.`);
    if (sceneLocationTime) idPromptParts.push(`Latar Tempat & Waktu: Adegan berlangsung di ${sceneLocationTime}.`);
    
    let visualDetailsDesc = "Detail Visual Tambahan:";
    const selectedCameraMovement = CAMERA_MOVEMENTS.find(cm => cm.value === cameraMovementValue);
    if (selectedCameraMovement && selectedCameraMovement.value) {
      visualDetailsDesc += `\n  - Gerakan Kamera: ${selectedCameraMovement.label_id} (${selectedCameraMovement.label_en}).`;
    }
    if (additionalVisualDetails) {
      visualDetailsDesc += `\n  - Catatan Visual Lainnya: ${additionalVisualDetails}.`;
    }
    if (visualDetailsDesc !== "Detail Visual Tambahan:") idPromptParts.push(visualDetailsDesc);

    if (overallAtmosphere) idPromptParts.push(`Suasana Keseluruhan: Atmosfer yang ingin dibangun adalah ${overallAtmosphere}.`);
    if (environmentalSounds) idPromptParts.push(`Suara Lingkungan/Ambience: SOUND: ${environmentalSounds}`);
    if (characterDialog) idPromptParts.push(`Dialog Karakter: DIALOG dalam Bahasa Indonesia: Karakter berkata: "${characterDialog}"`);
    
    const developedIndonesianPrompt = idPromptParts.join('\n\n');
    setEditableIndonesianPrompt(developedIndonesianPrompt);

    // --- Generate Final English-Labelled Prompt ---
    let enPromptSections: string[] = [];
    if (sceneTitle) enPromptSections.push(`Scene Title: ${sceneTitle}`);
    if (characterCoreDescription) enPromptSections.push(`Core Character Description: ${characterCoreDescription}`);
    if (characterVoiceDetails) enPromptSections.push(`Character Voice Details: ${characterVoiceDetails}\nIMPORTANT: All dialogue must be in Indonesian with natural and clear pronunciation. Ensure this character's voice is consistent throughout the video.`);
    if (characterAction) enPromptSections.push(`Character Action: ${characterAction}`);
    if (characterExpression) enPromptSections.push(`Character Expression: ${characterExpression}`);
    if (sceneLocationTime) enPromptSections.push(`Scene Location & Time: ${sceneLocationTime}`);
    
    let enVisualDetails = "Additional Visual Details:";
    if (selectedCameraMovement && selectedCameraMovement.value) {
       enVisualDetails += `\n  - Camera Movement: ${selectedCameraMovement.label_en}.`;
    }
    if (additionalVisualDetails) {
        enVisualDetails += `\n  - Other Visual Notes: ${additionalVisualDetails}.`;
    }
     if (enVisualDetails !== "Additional Visual Details:") enPromptSections.push(enVisualDetails);

    if (overallAtmosphere) enPromptSections.push(`Overall Atmosphere: ${overallAtmosphere}`);
    if (environmentalSounds) enPromptSections.push(`Environmental Sounds/Ambience: SOUND: ${environmentalSounds}`);
    if (characterDialog) enPromptSections.push(`Character Dialogue (in Indonesian): DIALOGUE in Bahasa Indonesia: Character says: "${characterDialog}"`);

    let finalEnPrompt = enPromptSections.join('\n\n');
    
    let enAdditionalParamsArray: string[] = [];
    enAdditionalParamsArray.push(`--ar ${aspectRatio}`);
    if (negativePrompt) enAdditionalParamsArray.push(`--no ${negativePrompt}`);

    if (enAdditionalParamsArray.length > 0) {
      finalEnPrompt += `\n\n${enAdditionalParamsArray.join(' ')}`;
    }
    
    setFinalEnglishPrompt(finalEnPrompt.trim());
    setCopySuccess('');

  }, [formState]);

  const handleCopyToClipboard = useCallback(() => {
    if (!finalEnglishPrompt) return;
    navigator.clipboard.writeText(finalEnglishPrompt).then(() => {
      setCopySuccess('Prompt Veo 3 (Format Final) Tersalin!');
      setTimeout(() => setCopySuccess(''), 2000);
    }).catch(err => {
      console.error('Gagal menyalin: ', err);
      setCopySuccess('Gagal menyalin');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  }, [finalEnglishPrompt]);

  const handleResetForm = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
    setEditableIndonesianPrompt('');
    setFinalEnglishPrompt('');
    setCopySuccess('');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-lg p-6 sm:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-sky-400">Veo 3 Prompt Generator by Aidil Creative</h1>
          <p className="mt-2 text-slate-400">Buat prompt karakter yang sangat detail dan konsisten untuk Veo 3 (hipotetis).</p>
        </header>

        <div className="space-y-6">
          <FormField label="Judul Scene" htmlFor="sceneTitle" tooltip="Contoh: terminal bus malam">
            <TextInput id="sceneTitle" name="sceneTitle" value={formState.sceneTitle} onChange={handleChange} placeholder="contoh: terminal bus malam yang ramai"/>
          </FormField>

          <FormField label="Deskripsi Karakter Inti" htmlFor="characterCoreDescription" tooltip="Contoh: Seorang vlogger wanita muda asal Banjarmasin berusia 27 tahun. Perawakan/Bentuk Tubuh: tubuh mungil, tinggi 158cm...">
            <TextAreaInput id="characterCoreDescription" name="characterCoreDescription" value={formState.characterCoreDescription} onChange={handleChange} placeholder="contoh: Seorang vlogger wanita muda asal Banjarmasin berusia 27 tahun, tubuh mungil, tinggi 158cm, kulit sawo matang cerah, rambut ikal sebahu diikat setengah ke belakang. Wajah oval, alis tebal, mata hitam besar, senyum ramah. Pakaian: jaket parasut kuning mustard, celana panjang hitam, ransel kecil." rows={6}/>
          </FormField>

          <FormField label="Detail Suara Karakter" htmlFor="characterVoiceDetails" tooltip="Contoh: Dia berbicara dengan suara wanita muda yang hangat dan penuh semangat. Nada: mezzo-soprano...">
            <TextAreaInput id="characterVoiceDetails" name="characterVoiceDetails" value={formState.characterVoiceDetails} onChange={handleChange} placeholder="contoh: Suara wanita muda, hangat, semangat. Nada: mezzo-soprano. Timbre: bersahabat, enerjik. Aksen: Indonesia dengan sentuhan khas Banjarmasin halus. Tempo: sedang-cepat. PENTING: Seluruh dialog harus dalam Bahasa Indonesia, natural dan jelas." rows={5}/>
          </FormField>
          
          <FormField label="Aksi Karakter" htmlFor="characterAction" tooltip="Contoh: berjalan di sekitar terminal bus malam sambil melihat-lihat aktivitas penumpang dan pedagang.">
            <TextAreaInput id="characterAction" name="characterAction" value={formState.characterAction} onChange={handleChange} placeholder="contoh: berjalan di terminal, merekam vlog, berinteraksi dengan pedagang" rows={3}/>
          </FormField>

          <FormField label="Ekspresi Karakter" htmlFor="characterExpression" tooltip="Contoh: Karakter menunjukkan ekspresi kagum dan antusias, sering tersenyum sambil melirik kamera.">
            <TextAreaInput id="characterExpression" name="characterExpression" value={formState.characterExpression} onChange={handleChange} placeholder="contoh: kagum, antusias, sering tersenyum, melirik kamera sesekali" rows={3}/>
          </FormField>

          <FormField label="Latar Tempat & Waktu" htmlFor="sceneLocationTime" tooltip="Contoh: latar tempat: di terminal bus antar kota malam hari... Waktu: malam hari, hujan rintik-rintik.">
            <TextAreaInput id="sceneLocationTime" name="sceneLocationTime" value={formState.sceneLocationTime} onChange={handleChange} placeholder="contoh: Terminal bus antar kota yang ramai di malam hari. Banyak pedagang kaki lima, bus-bus berjajar dengan lampu menyala. Waktu: malam hari, sekitar pukul 20.00, baru saja reda hujan rintik-rintik, aspal terlihat basah." rows={4}/>
          </FormField>

          <FormField label="Detail Visual Tambahan" htmlFor="additionalVisualDetails" tooltip="Contoh: Pencahayaan: natural dari lampu jalan dan bus. Gaya Video: cinematic realistis. Kualitas: 4K.">
            <TextAreaInput id="additionalVisualDetails" name="additionalVisualDetails" value={formState.additionalVisualDetails} onChange={handleChange} placeholder="contoh: Gerakan Kamera akan dipilih di bawah. Pencahayaan: natural dari lampu jalan dan bus, pantulan cahaya pada aspal basah. Gaya Video/Art Style: cinematic realistis dengan warna sedikit hangat. Kualitas Visual: Resolusi 4K." rows={4}/>
          </FormField>
          
          <FormField label="Gerakan Kamera" htmlFor="cameraMovement">
            <SelectInput
              id="cameraMovement"
              name="cameraMovement"
              value={formState.cameraMovement}
              onChange={handleChange}
              options={CAMERA_MOVEMENTS}
              useIndonesianLabel={true}
            />
          </FormField>

          <FormField label="Suasana Keseluruhan" htmlFor="overallAtmosphere" tooltip="Contoh: Suasana sibuk, ramai, dengan kesan perjalanan malam yang hidup dan dinamis.">
            <TextAreaInput id="overallAtmosphere" name="overallAtmosphere" value={formState.overallAtmosphere} onChange={handleChange} placeholder="contoh: Sibuk, ramai, penuh antisipasi perjalanan malam, hangat meskipun gerimis, dinamis." rows={3}/>
          </FormField>
          
          <FormField label="Suara Lingkungan/Ambience" htmlFor="environmentalSounds" tooltip="Contoh: SOUND: suara mesin bus menyala, pengumuman dari pengeras suara, derai hujan ringan...">
            <TextAreaInput id="environmentalSounds" name="environmentalSounds" value={formState.environmentalSounds} onChange={handleChange} placeholder="contoh: suara mesin bus menyala dan berhenti, pengumuman keberangkatan dari pengeras suara, derai hujan ringan di atap terminal, percakapan samar antar penumpang dan pedagang, suara roda koper diseret." rows={4}/>
          </FormField>
          
          <FormField label="Dialog Karakter (Bahasa Indonesia)" htmlFor="characterDialog" tooltip="Contoh: Tiap kota punya terminal kayak gini, dan aku suka banget suasana malamnya…">
            <TextAreaInput id="characterDialog" name="characterDialog" value={formState.characterDialog} onChange={handleChange} placeholder="contoh: Tiap kota punya terminal kayak gini, dan aku suka banget suasana malamnya… hangat walau gerimis begini. Rasanya kayak perjalanan baru mau dimulai." rows={4}/>
          </FormField>
          
          <hr className="my-8 border-slate-700" />
          <h2 className="text-xl font-semibold text-sky-400 mb-4">Parameter Teknis</h2>
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormField label="Aspek Rasio" htmlFor="aspectRatio">
                <SelectInput
                id="aspectRatio"
                name="aspectRatio"
                value={formState.aspectRatio}
                onChange={handleChange}
                options={ASPECT_RATIOS.map(ar => ({value: ar.value, label: ar.label}))}
                />
            </FormField>
            
            <FormField label="Negative Prompt (Opsional)" htmlFor="negativePrompt" className="md:col-span-2" tooltip="Hindari: teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak, anomali, wajah ganda, anggota badan cacat, tangan tidak normal, orang tambahan, objek mengganggu, kualitas rendah, buram, glitch, suara robotik, suara pecah.">
            <TextAreaInput
                id="negativePrompt"
                name="negativePrompt"
                value={formState.negativePrompt}
                onChange={handleChange}
                placeholder="contoh: teks di layar, subtitle, logo, distorsi, buram, glitch, suara robotik"
                rows={3}
            />
            </FormField>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={generatePrompt}
            className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Buat Prompt"
          >
            Buat Prompt
          </button>
          <button
            onClick={handleResetForm}
            className="flex-1 bg-slate-600 hover:bg-slate-700 text-slate-100 font-semibold py-3 px-4 rounded-md shadow-md transition duration-150 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            aria-label="Reset Isian"
          >
            <ResetIcon className="w-5 h-5 mr-2" />
            Reset Isian
          </button>
        </div>

        {(editableIndonesianPrompt || finalEnglishPrompt) && (
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-sky-400 mb-6 text-center">Hasil Prompt Veo 3</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-300 mb-2">Prompt Bahasa Indonesia (Dapat Diedit)</h4>
                <TextAreaInput
                  id="editableIndonesianPrompt"
                  value={editableIndonesianPrompt}
                  onChange={handleIndonesianPromptChange}
                  className="w-full h-96 p-3 bg-slate-700 border border-slate-600 rounded-md text-slate-200 resize-y focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label="Prompt Bahasa Indonesia yang Dapat Diedit"
                  rows={15}
                />
              </div>
              <div className="relative">
                <h4 className="text-lg font-semibold text-slate-300 mb-2">Prompt Bahasa Inggris Final (Untuk Veo 3)</h4>
                <TextAreaInput
                  readOnly
                  id="finalEnglishPrompt"
                  value={finalEnglishPrompt}
                  className="w-full h-96 p-3 bg-slate-700 border border-slate-600 rounded-md text-slate-200 resize-y focus:outline-none focus:ring-2 focus:ring-sky-500"
                  aria-label="Prompt Bahasa Inggris Final untuk Veo 3"
                  rows={15}
                />
                {finalEnglishPrompt && (
                    <button
                        onClick={handleCopyToClipboard}
                        className="absolute top-10 right-2 p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-700"
                        title="Salin Cepat Prompt Veo 3"
                        aria-label="Salin Cepat Prompt Veo 3 (Format Final) ke Clipboard"
                    >
                        <ClipboardIcon className="w-5 h-5" />
                    </button>
                )}
                {finalEnglishPrompt && (
                    <button
                        onClick={handleCopyToClipboard}
                        className="mt-3 w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-md shadow-md transition duration-150 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                        aria-label="Salin Prompt Veo 3 (Format Final) ke Clipboard"
                    >
                        <ClipboardIcon className="w-5 h-5 mr-2" />
                        Salin Prompt Veo 3
                    </button>
                )}
              </div>
            </div>
            {copySuccess && <p className="mt-4 text-center text-sm text-green-400">{copySuccess}</p>}
            
            <div className="mt-8 text-xs text-slate-400 bg-slate-750 p-4 rounded-md">
              <p className="font-semibold mb-2">Catatan Struktur Prompt:</p>
              <p className="mb-1"><strong className="text-sky-400">Prompt Bahasa Indonesia:</strong> Ditujukan untuk Anda review dan kembangkan lebih lanjut. Ini adalah versi naratif yang lebih deskriptif.</p>
              <p><strong className="text-sky-400">Prompt Bahasa Inggris Final:</strong> Ini adalah prompt yang lebih terstruktur dengan label Bahasa Inggris (sesuai standar umum) yang ditujukan untuk model AI seperti Veo 3. Dialog karakter tetap dalam Bahasa Indonesia sesuai permintaan. Bagian ini yang akan disalin ke clipboard.</p>
            </div>
          </div>
        )}
        <footer className="mt-12 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Veo 3 Prompt Generator by Aidil Creative. Untuk tujuan ilustrasi.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
