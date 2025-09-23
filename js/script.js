// Element references
const form = document.getElementById('letterForm');
const paperPreview = document.getElementById('paperPreview');

const previewLogo = document.getElementById('previewLogo');
const previewHead = document.getElementById('previewHead');
const previewNumber = document.getElementById('previewNumber');
const previewDate = document.getElementById('previewDate');
const previewTitle = document.getElementById('previewTitle');
const previewBody = document.getElementById('previewBody');

const sigImg1 = document.getElementById('sigImg1');
const sigImg2 = document.getElementById('sigImg2');
const sigImg3 = document.getElementById('sigImg3');

const sigName1 = document.getElementById('sigName1');
const sigName2 = document.getElementById('sigName2');
const sigName3 = document.getElementById('sigName3');

const sigTitle1 = document.getElementById('sigTitle1');
const sigTitle2 = document.getElementById('sigTitle2');
const sigTitle3 = document.getElementById('sigTitle3');

const base64Output = document.getElementById('base64Output');
const base64Content = document.getElementById('base64Content');

// Utility: safe get value
const val = id => (document.getElementById(id) ? document.getElementById(id).value : '');

// Update preview contents and positions
function updatePreview() {
  // Kepala surat
  previewHead.textContent = val('letterHead') || 'Kepala Surat';

  // Nomor & tanggal
  previewNumber.textContent = (val('letterNumber') ? `No: ${val('letterNumber')}` : 'No: -');
  previewDate.textContent = (val('letterDate') ? formatDate(val('letterDate')) : '-');

  // Title & body
  previewTitle.textContent = val('letterTitle') || 'Judul Surat';
  previewBody.textContent = val('letterBody') || 'Isi surat akan tampil di sini.';

  // Tanda tangan - nama & jabatan
  sigName1.textContent = val('sigInputName1') || 'Nama Yang Menerima';
  sigTitle1.textContent = 'Yang Menerima';

  sigName2.textContent = val('sigInputName2') || 'Nama Security';
  sigTitle2.textContent = 'Security';

  sigName3.textContent = val('sigInputName3') || 'Nama Kepala Gudang';
  sigTitle3.textContent = 'Kepala Gudang';

  // Posisi tanda tangan (apply to each image)
  applySigPosition(sigImg1, 'sigPosX1', 'sigPosY1');
  applySigPosition(sigImg2, 'sigPosX2', 'sigPosY2');
  applySigPosition(sigImg3, 'sigPosX3', 'sigPosY3');
}

// Format tanggal (Indonesia)
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Apply position to signature image
function applySigPosition(imgEl, posXId, posYId) {
  if (!imgEl) return;
  const x = parseInt(val(posXId) || '0', 10);
  const y = parseInt(val(posYId) || '0', 10);

  // If image not visible yet, just set default styles
  if (!imgEl.src) {
    imgEl.style.display = 'none';
    return;
  }

  imgEl.style.position = 'absolute';
  // Use 'right' offset for X (so user can push image inward from right)
  imgEl.style.right = `${x}px`;
  imgEl.style.top = `${y}px`;
  imgEl.style.display = 'block';
}

// Handle file -> preview image (logo or signatures)
function fileToImage(fileInputId, imgEl, maxSizeMB = 2) {
  const input = document.getElementById(fileInputId);
  if (!input) return;
  input.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar (PNG/JPG).');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Ukuran file maksimal ${maxSizeMB} MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      imgEl.src = ev.target.result;
      imgEl.style.display = 'block';
      updatePreview(); // update posisi & layout
    };
    reader.readAsDataURL(file);
  });
}

// Attach handlers for logo & signatures
fileToImage('letterLogo', previewLogo);
fileToImage('sigInputFile1', sigImg1);
fileToImage('sigInputFile2', sigImg2);
fileToImage('sigInputFile3', sigImg3);

// PDF download
document.getElementById('downloadPDF').addEventListener('click', async () => {
  try {
    const canvas = await html2canvas(paperPreview, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('surat.pdf');
  } catch (err) {
    console.error(err);
    alert('Gagal membuat PDF. Coba lagi.');
  }
});

// Base64 generation
document.getElementById('generateBase64').addEventListener('click', async () => {
  try {
    const canvas = await html2canvas(paperPreview, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const base64 = canvas.toDataURL('image/png');
    base64Content.textContent = base64;
    base64Output.style.display = 'block';
    try { await navigator.clipboard.writeText(base64); alert('Base64 berhasil disalin ke clipboard!'); }
    catch (e) { alert('Base64 dibuat — silakan copy manual dari kotak.'); }
  } catch (err) {
    console.error(err);
    alert('Gagal membuat Base64. Coba lagi.');
  }
});

// Auto-update preview on input changes
form.querySelectorAll('input, textarea, select').forEach(inp => {
  inp.addEventListener('input', updatePreview);
});

// Default date
if (document.getElementById('letterDate')) {
  document.getElementById('letterDate').value = new Date().toISOString().split('T')[0];
}

// Initial render
updatePreview();