const apiURL = "https://mindicador.cl/api/";
const inputMonto = document.getElementById("monto");
const selectMoneda = document.getElementById("moneda");
const btnBuscar = document.getElementById("btnBuscar");
const resultadoTexto = document.getElementById("resultado");
const errorMsg = document.getElementById("error-msg");
let myChart = null; 


async function getMonedas(moneda) {
    try {
        const res = await fetch(`${apiURL}${moneda}`);
        if (!res.ok) throw new Error("No se pudo conectar con la API");
        const data = await res.json();
        return data;
    } catch (e) {
        errorMsg.textContent = `Error: ${e.message}`;
    }
}


function calcularConversion(monto, valorMoneda) {
    const conversion = monto / valorMoneda;
    resultadoTexto.textContent = `Resultado: $${conversion.toFixed(2)}`;
}


function renderGrafico(serie) {
    const ultimosDiez = serie.slice(0, 10).reverse();
    const labels = ultimosDiez.map(dia => dia.fecha.split("T")[0]);
    const data = ultimosDiez.map(dia => dia.valor);

    const ctx = document.getElementById('myChart');
    
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Historial últimos 10 días',
                data: data,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false 
                }
            }
        }
    });
}


btnBuscar.addEventListener("click", async () => {
    const monto = inputMonto.value;
    const monedaSeleccionada = selectMoneda.value;

    
    errorMsg.textContent = "";

    if (!monto) {
        alert("Por favor ingresa un monto");
        return;
    }

    if (!monedaSeleccionada) {
        alert("Por favor selecciona una moneda");
        return;
    }

    const data = await getMonedas(monedaSeleccionada);
    
    if (data) {
        const valorActual = data.serie[0].valor;
        calcularConversion(monto, valorActual);
        renderGrafico(data.serie);
    }
});