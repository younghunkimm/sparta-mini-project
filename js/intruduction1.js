//팔로워 증가 로직
    window.onload = function () {
        let count = 500;    //초기 팔로워 수
        const btns_click = document.getElementById("following")
        const followers_value = document.getElementById("followers")

        btns_click.addEventListener('click', () => {
            count++;
            followers_value.textContent = count;
        });
    };