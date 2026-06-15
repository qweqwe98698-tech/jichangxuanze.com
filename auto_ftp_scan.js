const ftp = require("basic-ftp");

async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "156.236.113.37",
            user: "clashmac",
            password: "^W%7Wi~Yi.Ef-+dT^W%7Wi~Yi.Ef-+dT",
            secure: false
        });
        
        console.log("Listing /public_html:");
        const list1 = await client.list("/public_html");
        console.log(list1.map(f => f.name).filter(n => n.includes('htaccess')));
        
        console.log("Listing /:");
        const list2 = await client.list("/");
        console.log(list2.map(f => f.name).filter(n => n.includes('htaccess')));

        await client.close();
    } catch (err) {
        console.error(err);
    }
}
run();
