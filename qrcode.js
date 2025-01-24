// Fonction pour générer et télécharger le PDF
downloadPdfButton.addEventListener('click', async () => {
    if (steps.length === 0) {
      alert('Veuillez ajouter des étapes avant de télécharger.');
      return;
    }
  
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
  
      // Générer une URL dynamique pour l'indice
      const pageURL = `http://localhost:5500/indice.html?step=${encodeURIComponent(step.hint)}`;
      const qrCodeData = await QRCode.toDataURL(pageURL); // Utilisation de QRCode.toDataURL pour générer l'image
  
      // Ajouter QR code et texte dans le PDF sur une page distincte
      doc.text(`Étape ${i + 1}: ${step.name}`, 10, 20); // Texte en haut de la page
      doc.addImage(qrCodeData, 'PNG', 60, 50, 90, 90); // Position et taille du QR code
  
      if (i < steps.length - 1) doc.addPage(); // Ajouter une nouvelle page sauf pour la dernière étape
    }
  
    doc.save('chasse_au_tresor.pdf');
  });