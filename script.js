const webhookURL = "https://discord.com/api/webhooks/1453209926527746068/Ao25I27qK1Jy3RoPO7TNKPmWhgD-BD2atzBGwhfF07wlVPIURqftOBfxmL8zxxUxdta1";

// ฟังก์ชันเพิ่มแถวสินค้า
function addProductRow() {
    const productList = document.getElementById('product-list');
    const rowId = Date.now();
    const div = document.createElement('div');
    div.className = 'product-row-item';
    div.id = `row-${rowId}`;
    
    // ดึงรายชื่อจาก SHIRT_DESIGNS มาสร้าง Option
    const productOptions = SHIRT_DESIGNS.map(item => 
        `<option value="${item.name} (${item.price}.-)">${item.name} - ${item.price} บาท</option>`
    ).join('');

    div.innerHTML = `
        <button type="button" class="remove-btn" onclick="removeProductRow('${rowId}')">×</button>
        <div class="form-group">
            <label>👕 เลือกลายเสื้อ:</label>
            <select class="item-pattern" required>
                <option value="">-- กรุณาเลือกลายเสื้อ --</option>
                ${productOptions}
            </select>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
            <div class="form-group">
                <label>📏 ไซส์:</label>
                <select class="item-size" required>
                    <option value="M (อก 34-36)">M (อก 34-36)</option>
                    <option value="L (อก 36-38)">L (อก 36-38)</option>
                    <option value="XL (อก 38-40)">XL (อก 38-40)</option>
                    <option value="2XL (อก 40-42)">2XL (อก 40-42)</option>
                    <option value="3XL (อก 42-44)">3XL (อก 42-44)</option>
                    <option value="4XL (อก 44-46)">4XL (อก 44-46)</option>
                    <option value="5XL (อก 46-48)">5XL (อก 46-48)</option>
                    <option value="6XL (อก 48-50)">6XL (อก 48-50)</option>
                    <option value="7XL (อก 50-52)">7XL (อก 50-52)</option>
                </select>
            </div>
            <div class="form-group">
                <label>🎨 สี:</label>
                <select class="item-color" required>
                    <option value="ขาว">ขาว</option>
                    <option value="ดำ">ดำ</option>
                </select>
            </div>
            <div class="form-group">
                <label>📦 จำนวน:</label>
                <input type="number" class="item-qty" value="1" min="1" required>
            </div>
        </div>
    `;
    productList.appendChild(div);
}

function removeProductRow(id) {
    if (document.querySelectorAll('.product-row-item').length > 1) {
        document.getElementById(`row-${id}`).remove();
    } else {
        alert("ต้องมีรายการสินค้าอย่างน้อย 1 รายการครับ");
    }
}

// ตั้งค่าเริ่มต้นเมื่อโหลดหน้าเว็บ
window.onload = () => {
    addProductRow();
    handlePaymentUI(); 
};

const paymentSelect = document.getElementById('paymentMethod');
const slipSection = document.getElementById('slip-section');
const slipFile = document.getElementById('slipFile');

function handlePaymentUI() {
    if (paymentSelect.value === 'โอนเงิน') {
        slipSection.style.display = 'block';
        slipFile.required = true;
    } else {
        slipSection.style.display = 'none';
        slipFile.required = false;
        slipFile.value = "";
    }
}

paymentSelect.addEventListener('change', handlePaymentUI);

function closeSummary() { document.getElementById('summaryModal').style.display = 'none'; }

// จัดการการกดส่งฟอร์ม
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const payment = document.getElementById('paymentMethod').value;
    const file = document.getElementById('slipFile').files[0];
    
    if (payment === 'โอนเงิน' && !file) {
        alert("❌ กรุณาแนบรูปสลิปการโอนเงินก่อนยืนยันครับ");
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = "กำลังบันทึกข้อมูล...";

    let totalAmount = 0;
    let productDetailsTextSummary = "";
    
    document.querySelectorAll('.product-row-item').forEach(row => {
        const pattern = row.querySelector('.item-pattern').value;
        const fullSize = row.querySelector('.item-size').value;
        const color = row.querySelector('.item-color').value;
        const qty = parseInt(row.querySelector('.item-qty').value);
        
        // ดึงราคาออกจากวงเล็บ (1190.-)
        let price = 0;
        const priceMatch = pattern.match(/\(([^)]+)\)/);
        if(priceMatch) price = parseInt(priceMatch[1].replace(/\D/g, ''));
        
        totalAmount += (price * qty);
        productDetailsTextSummary += `• ${pattern} [${color}/${fullSize}] x${qty}\n`;
    });

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const houseNo = document.getElementById('houseNo').value;
    const street = document.getElementById('street').value || "-";
    const subDistrict = document.getElementById('subDistrict').value;
    const district = document.getElementById('district').value;
    const province = document.getElementById('province').value;
    const zipcode = document.getElementById('zipcode').value;

    const fullAddress = `${houseNo} ${street} ต.${subDistrict} อ.${district} จ.${province} ${zipcode}`;

    const embed = {
        title: payment === "โอนเงิน" ? `1. แบบโอนเงิน ยอด ${totalAmount}` : `2. แบบเก็บเงินปลายทาง ยอด ${totalAmount}`,
        description: `**ViewTyShop**\n**ช่องทาง:** ${payment}\n\n**ผู้รับ:** ${name}\n**ที่อยู่:** ${fullAddress}\n**เบอร์โทร:** ${phone}\n\n**รายการ:**\n${productDetailsTextSummary}`,
        color: payment === 'โอนเงิน' ? 3066993 : 15105570,
        footer: { text: `สั่งซื้อเมื่อ ${new Date().toLocaleString('th-TH')}` }
    };

    const formData = new FormData();
    if (payment === 'โอนเงิน' && file) formData.append('file', file, 'slip.png');
    formData.append('payload_json', JSON.stringify({ embeds: [embed] }));

    fetch(webhookURL, { method: 'POST', body: formData })
    .then(res => {
        if(res.ok) {
            document.getElementById('summaryDetails').innerHTML = `
                <div style="text-align:left; margin-top:15px; border-top: 1px solid #eee; padding-top: 10px;">
                    <b style="color: #5865F2;">การชำระ: ${payment}</b><br>
                    <b>ยอดรวม: ${totalAmount} บาท</b><br>
                    <hr>
                    <b>ชื่อ:</b> ${name}<br>
                    <b>ที่อยู่:</b> ${fullAddress}<br>
                    <b>เบอร์:</b> ${phone}<br><br>
                    <b>รายการสินค้า:</b><br>${productDetailsTextSummary.replace(/\n/g, '<br>')}
                </div>`;
            document.getElementById('summaryModal').style.display = 'flex';
            document.getElementById('orderForm').reset();
            document.getElementById('product-list').innerHTML = "";
            addProductRow();
            handlePaymentUI();
        } else {
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        }
    })
    .catch(err => alert("การเชื่อมต่อล้มเหลว"))
    .finally(() => {
        btn.disabled = false;
        btn.innerText = "ยืนยันการสั่งซื้อ";
    });
});
