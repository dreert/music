let carrito = [];

function seleccionar(btn) {
    const grupo = btn.closest('.sizes');
    grupo.querySelectorAll('.size-btn').forEach(b => b.classList.remove('activa'));
    btn.classList.add('activa');
}

function agregarAlCarrito(btn, nombre, precio, tieneTalla) {
    const producto = btn.closest('.product');
    let talla = null;

    if (tieneTalla) {
        const activa = producto.querySelector('.size-btn.activa');
        if (!activa) {
            showToast('⚠️ Selecciona una talla primero', '#c1121f');
            return;
        }
        talla = activa.textContent;
    }

    const key = nombre + (talla ? `-${talla}` : '');
    const existente = carrito.find(i => i.id === key);

    if (existente) {
        existente.qty++;
    } else {
        carrito.push({ id: key, name: nombre, price: precio, size: talla, qty: 1 });
    }

    renderCarrito();
    showToast(`✔️ ${nombre}${talla ? `(${talla})` : ''} añadido`);

    btn.textContent = '✔️ Añadido';
    btn.classList.add('added');
    setTimeout(() => {
        btn.textContent = '+ Añadir al carrito';
        btn.classList.remove('added');
    }, 1500);
}

function cambiarCantidad(id, delta) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) carrito = carrito.filter(i => i.id !== id);
    renderCarrito();
}

function eliminarItem(id) {
    carrito = carrito.filter(i => i.id !== id);
    renderCarrito();
}

function renderCarrito() {
    const container = document.getElementById('cart-items');
    const total = carrito.reduce((s, i) => s + i.price * i.qty, 0);
    const count = carrito.reduce((s, i) => s + i.qty, 0);

    document.getElementById('cart-count').textContent = count;
    document.getElementById('subtotal-val').textContent =` $${total.toFixed(2)}`;
    document.getElementById('total-val').textContent = `$${total.toFixed(2)}`;
    document.getElementById('checkout-btn').disabled = carrito.length === 0;

    if (carrito.length === 0) {
        container.innerHTML =  `<div class="cart-empty"><span>🛒</span>Tu carrito está vacío.<br>¡Agrega algo!</br> </div> `;
        return;
    }

    container.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? ` <div class="cart-item-size">Talla: ${item.size}</div> ` : ''}
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="cambiarCantidad('${item.id}', -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="cambiarCantidad('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
            <button class="remove-item" onclick="eliminarItem('${item.id}')" title="Eliminar">✕</button>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cart-panel').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
}

function showToast(msg, color = '#1a6b30') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.background = color;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2200);
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    abrirModal();
});
  

function generarFactura(nombre) {
    const { jsPDF } = window.jspdf;
    const doc   = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const m     = 20;
    const nFact = 'ML-' + Date.now().toString().slice(-8);
    const fecha = new Date().toLocaleDateString('es-CO', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    // Cabecera
    doc.setFillColor(180,0,0)
    doc.rect(0, 0, pageW, 40, 'F');
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.setTextColor(255,255,255);
doc.text(' MUSIC-LINE', m,22);     
    doc.setFontSize(8); doc.setFont('helvetica', 'normal');
    doc.setTextColor(255,255,255);
    doc.text('TIENDA OFICIAL', m,31);
    doc.setFontSize(9); doc.setTextColor(255,255,255);
    doc.text(nFact, pageW - m, 20, { align: 'right' });
    doc.text(fecha, pageW - m, 28, { align: 'right' });

    // Nombre cliente
    let y = 50;
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.setTextColor(0,0,0);
    doc.text('FACTURA A NOMBRE DE:', m, y);
    doc.setFontSize(16); doc.setFont('helvetica', 'bold');
    doc.setTextColor(0,0,0);
    doc.text(nombre, m, y + 10);
    doc.setDrawColor(42, 42, 42);
    doc.line(m, y + 16, pageW - m, y + 16);

    // Tabla productos
    doc.autoTable({
        startY: y + 22,
        head: [['Producto', 'Talla', 'Cant.', 'Precio']],
        body: carrito.map(i => [
            i.name,
            i.size || '—',
            i.qty,
            '$' + (i.price * i.qty).toFixed(2)
        ]),
        margin: { left: m, right: m },
        headStyles: {
            fillColor: [30,80,160],
            textColor: [255,255,255],
            fontStyle: 'bold', fontSize: 9
        },
        styles: {
            textColor: [255,255,255],
            fillColor: [20,60,130],
            lineColor: [40, 40, 40],
            lineWidth: 0.2, fontSize: 10, cellPadding: 5
        },
        alternateRowStyles: { fillColor: [26, 26, 26] }
    });

    
    const subtotal = carrito.reduce((s, i) => s + i.price * i.qty, 0);
    const fy = doc.lastAutoTable.finalY + 10;
    doc.setFillColor(180,0,0);
    doc.roundedRect(pageW - m - 70, fy, 70, 20, 3, 3, 'F');
    doc.setFontSize(10); doc.setFont('helvetica', 'bold');
    doc.setTextColor(255,255,255);
    doc.text('SUBTOTAL', pageW - m - 64, fy + 13);
    doc.setTextColor(255,255,255)
    doc.text('$' + subtotal.toFixed(2), pageW - m - 4, fy + 13, { align: 'right' });

    // Pie
    doc.setFillColor(180,0,0);
    doc.rect(0, pageH - 12, pageW, 12, 'F');
    doc.setFontSize(7); doc.setFont('helvetica', 'normal');
    doc.setTextColor(255,255,255);
    doc.text('Music Line factura electronica · Documento generado electrónicamente', pageW / 2, pageH - 4, { align: 'center' });

    doc.save('Factura_MusicLine_' + nFact + '.pdf');
}

function abrirModal() {
    document.getElementById('overlay').classList.add('visible');
    document.getElementById('input-nombre').focus();
}

function cerrarModal() {
    document.getElementById('overlay').classList.remove('visible');
    document.getElementById('input-nombre').value = '';
}

function confirmarCompra() {
    const input  = document.getElementById('input-nombre');
    const nombre = input.value.trim();

    if (nombre === '') {
        input.style.borderColor = 'red';
        input.placeholder = '⚠️ El nombre es obligatorio';
        return;
    }

    input.style.borderColor = '';
    cerrarModal();
    generarFactura(nombre);
    showToast('🎉 ¡Pedido realizado! Gracias por tu compra.');
    carrito = [];
    renderCarrito();
    toggleCart();
}