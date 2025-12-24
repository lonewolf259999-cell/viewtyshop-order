const SHIRT_DESIGNS = [
    { name: "เสื้อลูกไม้", price: "1190" },
];

(function loadProducts() {
    const select = document.getElementById('pattern');
    SHIRT_DESIGNS.forEach(item => {
        const option = document.createElement('option');
        option.value = `${item.name} (${item.price}.-)`;
        option.textContent = `${item.name} - ${item.price} บาท`;
        select.appendChild(option);
    });
})();