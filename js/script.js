document.addEventListener("DOMContentLoaded", () => {
  const logoInput = document.getElementById("letterLogo");
  const headInput = document.getElementById("letterHead");
  const numberInput = document.getElementById("letterNumber");
  const dateInput = document.getElementById("letterDate");
  const titleInput = document.getElementById("letterTitle");
  const detail2Input = document.getElementById("letterDetail2");
  const detail3Input = document.getElementById("letterDetail3");

  // Preview elemen
  const previewLogo = document.getElementById("previewLogo");
  const previewHead = document.getElementById("previewHead");
  const previewNumber = document.getElementById("previewNumber");
  const previewDate = document.getElementById("previewDate");
  const previewTitle = document.getElementById("previewTitle");
  const previewDetail2 = document.getElementById("previewDetail2");
  const previewDetail3 = document.getElementById("previewDetail3");
  const dateBottom = document.getElementById("dateBottom");
  const previewTableBody = document.getElementById("previewTableBody");

  // Input -> Preview binding
  headInput.addEventListener("input", () => previewHead.textContent = headInput.value);
  numberInput.addEventListener("input", () => previewNumber.textContent = "No: " + numberInput.value);
  dateInput.addEventListener("input", () => {
    previewDate.textContent = "Tanggal: " + dateInput.value;
    dateBottom.textContent = dateInput.value;
  });
  titleInput.addEventListener("input", () => previewTitle.textContent = titleInput.value);
  detail2Input.addEventListener("input", () => previewDetail2.textContent = detail2Input.value);
  detail3Input.addEventListener("input", () => previewDetail3.textContent = detail3Input.value);

  // Logo
  logoInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        previewLogo.src = ev.target.result;
        previewLogo.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });

  // Tambah baris tabel input
  document.getElementById("addRow").addEventListener("click", () => {
    const table = document.querySelector("#inputTable tbody");
    const rowCount = table.rows.length + 1;
    const row = table.insertRow();
    row.innerHTML = `
      <td>${rowCount}</td>
      <td><input type="text" class="itemName"></td>
      <td><input type="text" class="itemUnit"></td>
      <td><input type="number" class="itemQty"></td>
      <td><input type="text" class="itemQtyText"></td>
    `;
  });

  // Update preview tabel
  document.getElementById("letterForm").addEventListener("input", () => {
    const rows = document.querySelectorAll("#inputTable tbody tr");
    previewTableBody.innerHTML = "";
    rows.forEach((row, i) => {
      const name = row.querySelector(".itemName").value;
      const unit = row.querySelector(".itemUnit").value;
      const qty = row.querySelector(".itemQty").value;
      const qtyText = row.querySelector(".itemQtyText").value;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i+1}</td>
        <td>${name}</td>
        <td>${unit}</td>
        <td>${qty}</td>
        <td>${qtyText}</td>
      `;
      previewTableBody.appendChild(tr);
    });
  });

  // Signature uploads
  function bindSig(inputId, imgId, nameId) {
    const fileInput = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    const name = document.getElementById(nameId);
    const nameInput = document.getElementById("sigInputName" + inputId.slice(-1));
    nameInput.addEventListener("input", () => name.textContent = nameInput.value);

    fileInput.addEventListener("change", e => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = ev => {
          img.src = ev.target.result;
          img.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }
  bindSig("sigInputFile1", "sigImg1", "sigName1");
  bindSig("sigInputFile2", "sigImg2", "sigName2");
  bindSig("sigInputFile3", "sigImg3", "sigName3");

  // Download PDF
  document.getElementById("downloadPDF").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    html2canvas(document.getElementById("paperPreview")).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("surat.pdf");
    });
  });
});