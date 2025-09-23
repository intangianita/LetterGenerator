function updatePreview() {
  document.getElementById("prevNomor").innerText = 
    document.getElementById("nomorSurat").value || "-";

  document.getElementById("prevTanggal").innerText = 
    document.getElementById("tanggalSurat").value || "-";

  document.getElementById("prevJudul").innerText = 
    document.getElementById("judulSurat").value || "Judul Surat";

  document.getElementById("prevDetail").innerText = 
    document.getElementById("detailSurat").value || "Detail surat akan muncul di sini...";

  document.getElementById("prevNamaMenerima").innerText = 
    document.getElementById("namaMenerima").value || "Nama Yang Menerima";

  document.getElementById("prevNamaSecurity").innerText = 
    document.getElementById("namaSecurity").value || "Nama Security";

  document.getElementById("prevNamaGudang").innerText = 
    document.getElementById("namaGudang").value || "Nama Kepala Gudang";
}

function downloadPDF() {
  const element = document.getElementById("previewContent");
  const opt = {
    margin:       0.5,
    filename:     'surat.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}