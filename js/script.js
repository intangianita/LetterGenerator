// Update preview teks
document.getElementById("letterHead").addEventListener("input", e => {
  document.getElementById("previewHead").innerText = e.target.value || "Kepala Surat";
});
document.getElementById("letterNumber").addEventListener("input", e => {
  document.getElementById("previewNumber").innerText = "No: " + (e.target.value || "-");
});
document.getElementById("letterDate").addEventListener("input", e => {
  const date = new Date(e.target.value);
  document.getElementById("previewDate").innerText = isNaN(date) ? "-" :
    date.toLocaleDateString("id-ID", { day:"numeric", month:"long", year:"numeric" });
});
document.getElementById("letterTitle").addEventListener("input", e => {
  document.getElementById("previewTitle").innerText = e.target.value || "Judul Surat";
});
document.getElementById("letterBody").addEventListener("input", e => {
  document.getElementById("previewBody").innerText = e.target.value || "Isi surat akan tampil di sini.";
});

// Upload logo
document.getElementById("letterLogo").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = document.getElementById("previewLogo");
      img.src = ev.target.result;
      img.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Upload tanda tangan + nama
function bindSigInput(nameId, fileId, imgId, previewNameId) {
  document.getElementById(nameId).addEventListener("input", e => {
    document.getElementById(previewNameId).innerText = e.target.value || "-";
  });
  document.getElementById(fileId).addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        const img = document.getElementById(imgId);
        img.src = ev.target.result;
        img.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}
bindSigInput("sigName1","sigFile1","sigImg1","sigPreviewName1");
bindSigInput("sigName2","sigFile2","sigImg2","sigPreviewName2");
bindSigInput("sigName3","sigFile3","sigImg3","sigPreviewName3");

// Download PDF
document.getElementById("downloadPDF").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  html2canvas(document.getElementById("paperPreview")).then(canvas => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("surat.pdf");
  });
});