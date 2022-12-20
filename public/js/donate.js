$(() => {
  $('#donationStart').click(() => {
    const isTronLinkInstalled = typeof tronWeb === 'object' && window.tronWeb;

    if (!isTronLinkInstalled) {
      console.log("NO TRONLINK. FALLBACK TO SPK DONATION")

    }

    donateSPK();

  })
});
