import axios from 'axios';
import './index.css';

/* =================== 메뉴 ==================== */
const navMypage = document.getElementById('nav-mypage'),
      navMenu = document.getElementById('nav-menu'),
      navClose = document.getElementById('nav-close')
       
/* 메뉴 보이기 */
navMenu.addEventListener('click', () => {
  navMypage.classList.add('show-menu')
})

/* 메뉴 감추기 */
navClose.addEventListener('click', () => {
  navMypage.classList.remove('show-menu')
})


/* =================== 드롭다운 토글 ==================== */
function toggleDropdown(dropdownId) {
  document.getElementById(dropdownId).classList.toggle('show');
}

/* 항목 감추기 */
window.onclick = function(event) {
  if (!event.target.matches('.mypage__btn') && !event.target.matches('.menu__btn')) {
    // 모든 드롭다운을 확인 후 닫음
    var dropdowns = document.getElementsByClassName('mypage__list');
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    var menuDropdowns = document.getElementsByClassName('menu__list');
    for (var j = 0; j < menuDropdowns.length; j++) {
      var openMenuDropdown = menuDropdowns[j];
      if (openMenuDropdown.classList.contains('show')) {
        openMenuDropdown.classList.remove('show');
      }
    }
  }
}

window.toggleDropdown = toggleDropdown;


/* =================== 카카오 로그인 ==================== */

// 1. 로그인 버튼 클릭 시 카카오 로그인 페이지로 리다이렉트
function handleKakaoLogin() {
  const kakaoParams = {
    client_id: "e66e5234504f77fe52966a18dc0ebeea",
    redirect_uri: "http://127.0.0.1:8000/api/v1/users/kakao/callback",
    response_type: "code",
  };
  const kParams = new URLSearchParams(kakaoParams).toString();

  // 카카오 로그인 페이지로 리디렉트
  window.location.href = `https://kauth.kakao.com/oauth/authorize?${kParams}`;
}

// 2. 로그인 후 콜백을 통해 받은 코드를 사용해 사용자 정보 가져오기
async function fetchUserInfo(code) {
  try {
    console.log("fetchUserInfo 호출 - code:", code);
    
    // 백엔드에 인증 코드 전송 및 사용자 정보 요청
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/kakao/callback/?code=${code}`, {
      withCredentials: true
    });

    const data = response.data;
    console.log("응답 데이터:", data);

    // 사용자 정보를 localStorage에 저장
    localStorage.setItem("userInfo", JSON.stringify(data));

    // 프론트엔드에서 홈 화면으로 리디렉션 처리
    if (data.redirect_url) {
      console.log("리디렉션 수행:", data.redirect_url);
      window.location.href = data.redirect_url;
    }
  } catch (error) {
    console.error("Kakao login failed:", error);
  }
}

// 3. 로그인 상태 확인 함수 (쿠키로 확인)
function isLoggedIn() {
  console.log("isLoggedIn 호출 - 쿠키 내용:", document.cookie);
  return document.cookie.includes("access_token");
}

// 4. 로그인 상태에 따라 버튼 텍스트 변경 및 이벤트 설정
function updateLoginState() {
  console.log("updateLoginState 호출");
  const loginBtn = document.getElementById("kakao-login-btn");
  if (isLoggedIn()) {
    // 로그인된 상태일 경우 로그아웃 버튼으로 전환
    loginBtn.textContent = "로그아웃";
    loginBtn.removeEventListener("click", handleKakaoLogin);
    loginBtn.addEventListener("click", handleLogout);
  } else {
    // 로그인되지 않은 상태일 경우 로그인 버튼 설정
    loginBtn.textContent = "로그인";
    loginBtn.removeEventListener("click", handleLogout);
    loginBtn.addEventListener("click", handleKakaoLogin);
  }
}

// 5. 로그아웃 처리
function handleLogout() {
  // 로컬 스토리지와 쿠키 초기화
  localStorage.removeItem("userInfo");  // 필요 시 사용자 정보 삭제
  document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  updateLoginState();
  alert("로그아웃 완료");
  window.location.href = "/";  // 홈 페이지로 리디렉트
}

// 초기 로그인 상태 설정 및 URL에 code가 있는 경우 fetchUserInfo 호출
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded: updateLoginState 호출");

  // URL에서 code 파라미터 추출하여 사용자 정보 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (code) {
    console.log("code 확인:", code);
    await fetchUserInfo(code)  // code가 있을 때만 fetchUserInfo 호출
    updateLoginState();  // 로그인 상태 업데이트
    
    window.history.replaceState({}, document.title, "/");
  }
});

// 카카오 로그인 버튼에 초기 클릭 이벤트 추가
document.getElementById("kakao-login-btn").addEventListener("click", handleKakaoLogin);


/* =================== 카드 종합 순위 ==================== */
document.querySelector('.dropdown-button').addEventListener('click', function() {
  const menu = document.querySelector('.dropdown-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.dropdown');
  if (!dropdown.contains(event.target)) {
    document.querySelector('.dropdown-menu').style.display = 'none';
  }
});


/* =================== 카드 순위 ==================== */

// 연령대별
document.querySelector('.age-button').addEventListener('click', function() {
  const menu = document.querySelector('.age-dropdown-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.querySelectorAll('.age-dropdown-menu li').forEach(item => {
  item.addEventListener('click', function() {
      const selectedAge = item.getAttribute('data-age');
      document.querySelector('.age-button').innerText = `${selectedAge}대`;
      document.querySelector('.age-dropdown-menu').style.display = 'none';
      updateRankings(selectedAge);
  });
});

// Optional: To close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
  const dropdown = document.querySelector('.section');
  if (!dropdown.contains(event.target)) {
      document.querySelector('.age-dropdown-menu').style.display = 'none';
  }
});


const ageRanges = ['10-20', '20-30', '30-40', '40-50'];
let currentIndex = 0; // 초기 인덱스를 0으로 설정 (10-20대)

// 페이지가 로드될 때 초기 순위를 설정합니다.
window.addEventListener('DOMContentLoaded', function() {
    const selectedAge = ageRanges[currentIndex];
    document.querySelector('.age-button').innerText = `${selectedAge}대`;
    updateRankings(selectedAge); // 초기 순위 업데이트 함수 호출
});

// 왼쪽 화살표 버튼 이벤트
document.querySelector('.prev-age').addEventListener('click', function() {
    currentIndex = (currentIndex === 0) ? ageRanges.length - 1 : currentIndex - 1;
    const selectedAge = ageRanges[currentIndex];
    document.querySelector('.age-button').innerText = `${selectedAge}대`;
    updateRankings(selectedAge);
});

// 오른쪽 화살표 버튼 이벤트
document.querySelector('.next-age').addEventListener('click', function() {
    currentIndex = (currentIndex === ageRanges.length - 1) ? 0 : currentIndex + 1;
    const selectedAge = ageRanges[currentIndex];
    document.querySelector('.age-button').innerText = `${selectedAge}대`;
    updateRankings(selectedAge);
});

// 순위 업데이트 함수
function updateRankings(ageRange) {
  const rankingContainer = document.getElementById('age-rankings');
  let rankingsHtml = '';

  if (ageRange === '10-20') {
      rankingsHtml = `
          <div class="card-list">
              <li>
                <div class="rank">1</div>
                <img src="card_data/etc/payco_point.png" alt="PAYCO 포인트 카드">
                <div class="card-name">PAYCO 포인트 카드<br>엔에이치엔페이코</div>
              </li>
              <li>
                <div class="rank">2</div>
                <img src="card_data/kb/nori2.png" alt="노리2 체크카드">
                <div class="card-name">노리2 체크카드<br>KB국민카드</div>
              </li>
              <li>
                <div class="rank">3</div>
                <img src="card_data/shinhan/deepdream.png" alt="신한카드 Deep Dream 체크">
                <div class="card-name">신한카드 Deep Dream 체크<br>신한카드</div>
              </li>
              <li>
                <div class="rank">4</div>
                <img src="card_data/hana/naverpay.png" alt="네이버페이 머니 체크카드">
                <div class="card-name">네이버페이 머니 체크카드<br>하나카드</div>
              </li>
              <li>
                <div class="rank">5</div>
                <img src="card_data/kb/travelus.png" alt="트래블러스 체크카드">
                <div class="card-name">트래블러스 체크카드<br>KB국민카드</div>
              </li>
          </div>`;
  } else if (ageRange === '20-30') {
      rankingsHtml = `
          <div class="card-list">
              <li>
                <div class="rank">1</div>
                <img src="card_data/kb/nori.png" alt="노리체크카드">
                <div class="card-name">노리체크카드<br>KB국민카드</div>
              </li>
              <li>
                <div class="rank">2</div>
                <img src="card_data/kb/tosimi_check.png" alt="토심이 첵첵 체크카드">
                <div class="card-name">토심이 첵첵 체크카드<br>KB국민카드</div>
              </li>
              <li>
                <div class="rank">3</div>
                <img src="card_data/etc/k_one.png" alt="ONE 체크카드">
                <div class="card-name">ONE 체크카드<br>케이뱅크</div>
              </li>
              <li>
                <div class="rank">4</div>
                <img src="card_data/etc/naverpay.png" alt="네이버페이 머니카드">
                <div class="card-name">네이버페이 머니카드<br>네이버페이</div>
              </li>
              <li>
                <div class="rank">5</div>
                <img src="card_data/shinhan/sol_travel.png" alt="신한카드 SOL트래블 체크">
                <div class="card-name">신한카드 SOL트래블 체크<br>신한카드</div>
              </li>
          </div>`;
  } else if (ageRange === '30-40') {
    rankingsHtml = `
        <div class="card-list">
            <li>
                <div class="rank">1</div>
                <img src="card_data/etc/payco_point.png" alt="PAYCO 포인트 카드">
                <div class="card-name">PAYCO 포인트 카드<br>엔에이치엔페이코</div>
              </li>
              <li>
                <div class="rank">2</div>
                <img src="card_data/kb/nori2.png" alt="노리2 체크카드">
                <div class="card-name">노리2 체크카드<br>KB국민카드</div>
              </li>
              <li>
                <div class="rank">3</div>
                <img src="card_data/shinhan/deepdream.png" alt="신한카드 Deep Dream 체크">
                <div class="card-name">신한카드 Deep Dream 체크<br>신한카드</div>
              </li>
              <li>
                <div class="rank">4</div>
                <img src="card_data/hana/naverpay.png" alt="네이버페이 머니 체크카드">
                <div class="card-name">네이버페이 머니 체크카드<br>하나카드</div>
              </li>
              <li>
                <div class="rank">5</div>
                <img src="card_data/kb/travelus.png" alt="트래블러스 체크카드">
                <div class="card-name">트래블러스 체크카드<br>KB국민카드</div>
              </li>
        </div>`;
  } else if (ageRange === '40-50') {
    rankingsHtml = `
        <div class="card-list">
            <li>
              <div class="rank">1</div>
              <img src="card_data/kb/nori.png" alt="노리체크카드">
              <div class="card-name">노리체크카드<br>KB국민카드</div>
            </li>
            <li>
              <div class="rank">2</div>
              <img src="card_data/kb/tosimi_check.png" alt="토심이 첵첵 체크카드">
              <div class="card-name">토심이 첵첵 체크카드<br>KB국민카드</div>
            </li>
            <li>
              <div class="rank">3</div>
              <img src="card_data/etc/k_one.png" alt="ONE 체크카드">
              <div class="card-name">ONE 체크카드<br>케이뱅크</div>
            </li>
            <li>
              <div class="rank">4</div>
              <img src="card_data/etc/naverpay.png" alt="네이버페이 머니카드">
              <div class="card-name">네이버페이 머니카드<br>네이버페이</div>
            </li>
            <li>
              <div class="rank">5</div>
              <img src="card_data/shinhan/sol_travel.png" alt="신한카드 SOL트래블 체크">
              <div class="card-name">신한카드 SOL트래블 체크<br>신한카드</div>
            </li>
        </div>`;
  }

  rankingContainer.innerHTML = rankingsHtml;
}