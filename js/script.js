const form = document.getElementById('letterForm');
const paperPreview = document.getElementById('paperPreview');
const previewLogo = document.getElementById('previewLogo');

// Update preview
function updatePreview() {
  document.getElementById('letterHead').textContent =
    document.getElementById('letterHead').value || "Kepala Surat";
  document.getElementById('previewNumber').textContent =
    document.getElementById('letterNumber').value || "No: -";
  document.getElementById('previewDate').textContent =
    formatDate(document.getElementById('letterDate').value);
  document.getElementById('previewTitle').textContent =
    document.getElementById('letterTitle').value || "Judul Surat";
  document.getElementById('previewBody').textContent =
    document.getElementById('letterBody').value || "Isi surat akan tampil di sini.";
}

// Format tanggal ke format Indonesia
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  const months = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Set default date
document.getElementById('letterDate').value = new Date().toISOString().split('T')[0];

// Handle Logo Upload
document.getElementById('letterLogo').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      previewLogo.src = evt.target.result;
      previewLogo.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Handle PDF download
document.getElementById('downloadPDF').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  try {
    const canvas = await html2canvas(paperPreview, {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff'
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('surat.pdf');
  } catch (error) {
    alert('Gagal membuat PDF. Silakan coba lagi.');
    console.error('PDF Error:', error);
  }
});

// Handle Base64 generation
document.getElementById('generateBase64').addEventListener('click', async () => {
  try {
    const canvas = await html2canvas(paperPreview, {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff'
    });
    const base64 = canvas.toDataURL('image/png');
    document.getElementById('base64Content').textContent = base64;
    document.getElementById('base64Output').style.display = 'block';
    navigator.clipboard.writeText(base64).then(() => {
      alert('Base64 berhasil disalin ke clipboard!');
    }).catch(() => {
      alert('Base64 berhasil dibuat! Silakan copy manual dari kotak di bawah.');
    });
  } catch (error) {
    alert('Gagal membuat Base64. Silakan coba lagi.');
    console.error('Base64 Error:', error);
  }
});

// Auto-update preview on input
form.querySelectorAll('input, textarea, select').forEach(input => {
  input.addEventListener('input', updatePreview);
});

// Initial preview update
updatePreview();