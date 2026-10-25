import { icon, wireTabKeyboard } from "./ui.js";
export function initPhone() {
  if (!document.querySelector("#phone-screen")) return;
  const phoneHeader = (title) =>
    `<div class="phone-screen-header"><span>9:41</span><span>${title}</span>${icon("bag")}</div>`;
  const phoneNav =
    '<div class="phone-nav"><span>Bosh sahifa</span><span>Videolar</span><span>So‘rovlar</span></div>';
  const previews = [
    `${phoneHeader("Kashtan Market")}<div class="phone-banner"><span>HAMMASI BIR JOYDA</span><strong>Hayotingizga<br>yaqinroq.</strong><i>✳</i></div><p class="phone-small-title">Do‘konlar bilan tanishing</p><div class="phone-store-grid">${[
      ["ofiyat-logo", "Ofiyat"],
      ["shashlik-original", "Shashlik"],
      ["hardware-logo", "1005 xil mahsulot"],
      ["groceries-original", "Misqol Market"],
    ]
      .map(
        ([image, name]) =>
          `<div class="phone-store"><img src="/assets/images/${image}.webp" alt="" width="350" height="350" /><span>${name}</span></div>`,
      )
      .join(
        "",
      )}</div><div class="phone-info">${icon("message")}<span>Qidirganingiz topilmadimi?<small>Kerakli mahsulot haqida yozing</small></span></div>${phoneNav}`,
    `${phoneHeader("Video lenta")}<div class="phone-video"><img src="/assets/images/shashlik.webp" alt="Gril taomi tasvirlangan video muqovasi" width="1500" height="1001" />${icon("play")}<span>Yaxshi davralar<br>shu yerdan boshlanadi.</span></div><p class="phone-demo-label">VIDEO LENTA DIZAYNIDAN NAMUNA</p>${phoneNav}`,
    `${phoneHeader("Mahsulot so‘rovi")}<h3 class="phone-demo-heading">Qidirganingizni<br>bizga ayting.</h3><p class="phone-request-info">Do‘konda ko‘rmoqchi bo‘lgan mahsulotingiz haqida yozib qoldiring.</p><div class="phone-request">Masalan, uy uchun kichik asboblar to‘plami…</div><div class="phone-request-options"><span>+ Rasm</span><span>♪ Ovozli xabar</span></div><div class="phone-info">${icon("message")}<span>Sizga kerakli narsalar<small>Matn, rasm yoki ovoz orqali</small></span></div><p class="phone-demo-label">REJALASHTIRILGAN IMKONIYAT</p>${phoneNav}`,
  ];
  const featureTabs = [...document.querySelectorAll(".feature-tab")];
  const preview = document.querySelector("#app-preview");
  const phoneScreen = document.querySelector("#phone-screen");
  function selectFeature(index) {
    featureTabs.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    preview.setAttribute("aria-labelledby", `feature-${index}`);
    phoneScreen.innerHTML = previews[index];
  }
  featureTabs.forEach((tab, index) =>
    tab.addEventListener("click", () => selectFeature(index)),
  );
  wireTabKeyboard(featureTabs, true);
  selectFeature(0);
}
