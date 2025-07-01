
window.onload = () => {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
    document.getElementById("app").style.display = "block";
    fetchAsicData();
  }, 2500);
};

function fetchAsicData() {
  fetch("http://localhost:5000/api/asics")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("asic-list");
      list.innerHTML = "";
      data.forEach(asic => {
        const el = document.createElement("div");
        el.className = "asic";
        el.innerHTML = `
          <h3>${asic.model} (${asic.ip})</h3>
          <p>Хешрейт: ${asic.hashrate} TH/s</p>
          <p>Температура: ${asic.temp} °C</p>
          <p>Вентиляторы: ${asic.fans}</p>
          <div class="status ${asic.online ? 'online' : 'offline'}"></div>
        `;
        list.appendChild(el);
      });
    });
}
