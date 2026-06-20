const apiUrl = 'https://jichangpingce.club/zb_system/api.php';
const username = 'Yexiodi98K';
const password = 'Yexiodi98KYexiodi98KYexiodi98K';

async function testLogin() {
    try {
        console.log("尝试连接 Z-Blog API...");
        const response = await fetch(`${apiUrl}?mod=member&act=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        console.log("服务器响应数据:", data);

        if (data.code === 0 || data.code === 200 || data.data?.token) {
            console.log("\n✅ 成功绕过验证码！API 登录成功！");
            console.log("获取到访问令牌 (Token):", data.data.token.substring(0, 15) + "...");
        } else {
            console.error("\n❌ 登录失败:", data.message || "未知错误");
        }
    } catch (e) {
        console.error("\n请求出错 (可能是 API 没开或者地址不对):", e.message);
    }
}

testLogin();
