const { jsPDF } = window.jspdf;
const dropboxAccessToken = 'sl.B1dLqHpgrhoEHzqsmIxU-3RXZ-i_EoKkfatt0KEIOwlyXylY5omdOrotvQQdJZlIWUnikpXuwBIZLUaCJjcaC5VHnROdNg-UOBLhtHBU9wsUZSRghdQKD75bp4mzhrb1__65ioB1cbwa';

function generatePDF() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const country = document.getElementById('country').options[document.getElementById('country').selectedIndex].text;
    const phone = document.getElementById('phone').value;
    const payment = document.getElementById('payment').options[document.getElementById('payment').selectedIndex].text;
    const termsAccepted = document.getElementById('terms').checked;
    const video = document.getElementById('video').files[0];
    const link = document.getElementById('link').value;

    const canvas = document.getElementById('signature-pad');
    const signatureDataUrl = canvas.toDataURL('image/png');

    if (name && email && country && phone && payment && termsAccepted && video || link) {
        const doc = new jsPDF();

        doc.text('User Details', 10, 10);
        doc.text(`Name: ${name}`, 10, 20);
        doc.text(`Email: ${email}`, 10, 30);
        doc.text(`Country: ${country}`, 10, 40);
        doc.text(`Phone: ${phone}`, 10, 50);
        doc.text(`Payment Method: ${payment}`, 10, 60);
        doc.text(`Link: ${link}`, 10, 70);

        doc.addImage(signatureDataUrl, 'PNG', 10, 80, 100, 50);

        const pdfOutput = doc.output('blob');
        
        // Upload the PDF to Dropbox
        uploadToDropbox(pdfOutput, `${name}_details.pdf`);
    } else {
        alert('Please fill out all fields, sign, and accept the terms and conditions.');
    }
}

function clearSignature() {
    const canvas = document.getElementById('signature-pad');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function uploadToDropbox(fileBlob, fileName) {
    const dbx = new Dropbox.Dropbox({ accessToken: dropboxAccessToken });

    dbx.filesUpload({ path: `/${fileName}`, contents: fileBlob })
        .then(response => {
            alert('File uploaded successfully to Dropbox!');
        })
        .catch(error => {
            console.error('Error uploading file to Dropbox: ', error);
            alert('Failed to upload file to Dropbox.');
        });
}

document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('signature-pad');
    const context = canvas.getContext('2d');

    let drawing = false;

    canvas.addEventListener('mousedown', () => {
        drawing = true;
    });

    canvas.addEventListener('mouseup', () => {
        drawing = false;
        context.beginPath();
    });

    canvas.addEventListener('mousemove', draw);

    function draw(event) {
        if (!drawing) return;

        context.lineWidth = 2;
        context.lineCap = 'round';

        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.stroke();
        context.beginPath();
        context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    }
});
