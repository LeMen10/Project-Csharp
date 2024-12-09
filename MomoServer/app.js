const express = require('express');
const app = express();
const cors = require('cors');
const crypto = require('crypto');
const https = require('https');
const axios = require('axios');

// Middleware để phân tích JSON từ client
// Cấu hình CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Hoặc giới hạn domain cụ thể:
app.use(cors({
    origin: 'http://localhost:3000', // Domain của client
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));


app.post('/payment', (req, res) => {
    // Nhận tham số từ body
    const { amount, orderIdSuffix, bookingId } = req.body;

    if (!amount || !orderIdSuffix) {
        return res.status(400).json({ message: "Amount và orderIdSuffix là bắt buộc." });
    }

    // Thông tin cố định
    var accessKey = 'F8BBA842ECF85';
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var orderInfo = 'pay with MoMo';
    var partnerCode = 'MOMO';

    
    var ipnUrl = 'https://fb56-116-102-185-203.ngrok-free.app/payment-result';

    var requestType = "payWithMethod";
    var extraData = '';
    var orderId = partnerCode + orderIdSuffix; // Sử dụng suffix từ client
    var redirectUrl = `http://localhost:3000/user/purchase?type=noted&bookingID=${bookingId}`;
    var requestId = orderId;
    var orderGroupId = '';
    var autoCapture = true;
    var lang = 'vi';

    // Tạo raw signature
    var rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    // Tạo signature
    var signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    // Dữ liệu JSON gửi đến MoMo
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature
    });

    // Tạo HTTPS request
    const https = require('https');
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    // Gửi yêu cầu đến MoMo
    const paymentRequest = https.request(options, momoResponse => {
        console.log(`Status: ${momoResponse.statusCode}`);
        let data = '';
        momoResponse.on('data', chunk => {
            data += chunk;
        });
        momoResponse.on('end', () => {
            console.log('Response from MoMo: ', data);
            res.status(200).json(JSON.parse(data)); // Gửi phản hồi về client
        });
    });

    paymentRequest.on('error', e => {
        console.error(`Request error: ${e.message}`);
        res.status(500).json({ error: e.message });
    });

    console.log("Sending....");
    paymentRequest.write(requestBody);
    paymentRequest.end();
});

// API nhận thông báo từ MoMo (IPN)
app.post('/payment-result',async (req, res) => {
    console.log("call back: ");
    const { orderId, resultCode, message } = req.body;

    if (!orderId || resultCode === undefined) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ." });
    }

    // Kiểm tra kết quả giao dịch
    if (resultCode === 0) {
        console.log(`Thanh toán thành công cho orderId: ${orderId}`);
        // Cập nhật trạng thái giao dịch vào cơ sở dữ liệu
        return res.status(200).json({ message: "Giao dịch thành công." });
    } else {
        console.log(`Thanh toán thất bại cho orderId: ${orderId}. Lý do: ${message}`);
        // Xử lý giao dịch thất bại
        return res.status(200).json({ message: "Giao dịch thất bại." });
    }
   
});

app.post('/check-status-transaction', async (req, res) => {
    const { orderId } = req.body;
  
    // const signature = accessKey=$accessKey&orderId=$orderId&partnerCode=$partnerCode
    // &requestId=$requestId
    var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    var accessKey = 'F8BBA842ECF85';
    const rawSignature = `accessKey=${accessKey}&orderId=${orderId}&partnerCode=MOMO&requestId=${orderId}`;
  
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(rawSignature)
      .digest('hex');
  
    const requestBody = JSON.stringify({
      partnerCode: 'MOMO',
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: 'vi',
    });
  
    // options for axios
    const options = {
      method: 'POST',
      url: 'https://test-payment.momo.vn/v2/gateway/api/query',
      headers: {
        'Content-Type': 'application/json',
      },
      data: requestBody,
    };
  
    const result = await axios(options);
  
    return res.status(200).json(result.data);
  });

  app.post('/refund-payment', async (req, res) => {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
        return res.status(400).json({ message: "orderId và amount là bắt buộc." });
    }

    // Thông tin cố định
    const partnerCode = 'MOMO';
    const accessKey = 'F8BBA842ECF85';
    const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
    const requestId = `${partnerCode}${Date.now()}`;
    const description = 'Hoàn tiền giao dịch';

    // Tạo raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&description=${description}&orderId=${orderId}&partnerCode=${partnerCode}&requestId=${requestId}`;
    console.log("Raw Signature:", rawSignature);

    // Tạo signature bằng HMAC SHA256
    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log("Signature:", signature);

    // Dữ liệu gửi tới MoMo
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        requestId: requestId,
        orderId: orderId,
        amount: amount,
        description: description,
        lang: 'vi',
        signature: signature,
    });

    try {
        const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/refund', requestBody, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("MoMo Refund Response:", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Lỗi khi hoàn tiền:", error.response.data);
        res.status(500).json(error.response.data);
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

