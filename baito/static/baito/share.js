document.getElementById("copyBtn").onclick = async () => {
    const input = document.getElementById("shareUrl");

    try {
        await navigator.clipboard.writeText(input.value);

        const btn = document.getElementById("copyBtn");
        btn.textContent = "コピーしました！";
        btn.classList.add("copied");

        setTimeout(() => {
            btn.textContent = "URLをコピー";
            btn.classList.remove("copied");
        }, 2000);

    } catch (err) {
        alert("コピーに失敗しました");
    }
};
