import Image from "next/image";
import { getSection } from "@/lib/admin-data";
import { formatWebinarDate } from "@/lib/webinar";
import { WebinarCountdown } from "@/components/webinar/countdown";
import { WebinarRegisterForm } from "@/components/webinar/register-form";
import { WebinarMobileHeader } from "@/components/webinar/mobile-header";

const DEFAULT_WEBINAR_DATE = "2026-07-28T15:00:00.000Z";
const HEADER_PHONES = ["+380660607218", "+380671429560", "+380960912230", "+380633040046"];
const FOOTER_PHONES = ["+380660607218", "+380960912230", "+380671429560", "+380633040046"];

function formatPhone(raw: string) {
  return `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 9)} ${raw.slice(9, 11)} ${raw.slice(11, 13)}`;
}

const MONTSERRAT = "font-[family-name:var(--font-montserrat)]";

export const revalidate = 60;

export default async function WebinarPage() {
  const section = await getSection("webinar");
  const dateIso = (section?.content?.date as string | undefined) || DEFAULT_WEBINAR_DATE;
  const dateText = formatWebinarDate(dateIso);

  return (
    <div className="flex min-h-full max-w-full flex-col overflow-x-hidden bg-white pb-[76px] text-[#474C6B] min-[821px]:pb-0">
      {/* Header — desktop (unchanged, 1:1 with approved design) */}
      <header className="hidden bg-white min-[821px]:block">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-10 px-8 py-5">
          <a href="#top" className="flex shrink-0 items-center">
            <Image src="/webinar/logo.png" alt="VIPSTUDY" width={96} height={96} className="h-[72px] w-auto" />
          </a>
          <div className="grid grid-cols-[auto_auto] justify-items-start gap-x-10 gap-y-2 text-[15px] font-semibold whitespace-nowrap">
            {HEADER_PHONES.map((p) => (
              <a key={p} href={`tel:${p}`} className="text-[#E6308A] hover:text-[#C11367]">
                {formatPhone(p)}
              </a>
            ))}
          </div>
          <nav className="flex items-center gap-7">
            <a href="#how" className="text-[15px] font-semibold whitespace-nowrap tracking-[.04em] text-[#23285A] uppercase hover:text-[#E6308A]">
              Як вступити?
            </a>
            <a href="#program" className="text-[15px] font-semibold whitespace-nowrap tracking-[.04em] text-[#23285A] uppercase hover:text-[#E6308A]">
              Програма вебінару
            </a>
            <a
              href="#register"
              className="rounded-[10px] bg-[#F0158C] px-7 py-3.5 text-center text-[13px] font-bold tracking-[.1em] text-white uppercase shadow-[0_10px_24px_rgba(240,21,140,0.3)] transition-transform hover:bg-[#C11367] active:scale-[0.98]"
            >
              Зареєструватись
            </a>
          </nav>
        </div>
      </header>

      {/* Header — mobile (collapsed into a hamburger menu) */}
      <WebinarMobileHeader phones={HEADER_PHONES.map((p) => ({ raw: p, label: formatPhone(p) }))} />

      {/* Countdown ticker */}
      <div className="overflow-hidden bg-gradient-to-r from-[#F0158C] to-[#C11367] py-3 whitespace-nowrap text-white min-[821px]:py-[13px]">
        <div className="inline-flex animate-wb-marquee items-center">
          {[0, 1].map((i) => (
            <span
              key={i}
              aria-hidden={i === 1}
              className="inline-flex items-center gap-8 pr-8 text-[13px] font-extrabold tracking-[.06em] uppercase min-[821px]:gap-11 min-[821px]:pr-11 min-[821px]:text-[15px] min-[821px]:tracking-[.08em]"
            >
              <span className="inline-flex items-center gap-3">
                <span className="inline-block h-2.5 w-2.5 shrink-0 animate-wb-pulse rounded-full bg-white" />
                До вебінару залишилось <WebinarCountdown targetIso={dateIso} />
              </span>
              <span className="opacity-70">★</span>
              <span>Зареєструйся зараз — це безкоштовно</span>
              <span className="opacity-70">★</span>
              <span>Розіграш призів у прямому ефірі</span>
              <span className="opacity-70">★</span>
            </span>
          ))}
        </div>
      </div>

      <main>
        {/* Hero */}
        <section
          id="top"
          className="mx-auto grid max-w-[1280px] scroll-mt-6 grid-cols-1 items-center gap-8 px-5 py-10 min-[480px]:px-6 min-[821px]:grid-cols-[1fr_1.15fr] min-[821px]:gap-[72px] min-[821px]:px-8 min-[821px]:py-24"
        >
          <div>
            <h1 className={`${MONTSERRAT} mb-3 text-[24px] leading-[1.3] font-extrabold text-[#23285A] uppercase min-[480px]:text-[28px] min-[821px]:mb-4 min-[821px]:text-[46px] min-[821px]:leading-[1.25]`}>
              Безкоштовний вебінар
            </h1>
            <p className={`${MONTSERRAT} mb-4 text-lg leading-[1.35] font-bold text-[#23285A] min-[480px]:text-xl min-[821px]:mb-6 min-[821px]:text-[26px]`}>
              Як вступити до університету Словаччини у 2027 році?
            </p>
            <p className="mb-6 text-base font-bold text-[#E6308A] min-[480px]:text-lg min-[821px]:mb-8 min-[821px]:text-[22px]">
              {dateText} (за Києвом)
            </p>
            <p className="mb-4 text-[15px] leading-[1.5] font-semibold text-[#23285A] min-[480px]:text-base min-[821px]:mb-5 min-[821px]:text-lg">
              За одну годину ви дізнаєтеся все, що потрібно для успішного вступу до словацького університету:
            </p>
            <ul className="grid list-none gap-3.5 p-0 text-[15px] font-medium text-[#23285A] min-[480px]:text-base min-[821px]:gap-4 min-[821px]:text-lg">
              {[
                "Як вступити на безкоштовне навчання",
                "Чи можна вступити без НМТ та вступних іспитів",
                "Які документи потрібно підготувати та коли їх подавати",
                "Як отримати студентський ВНП, знайти гуртожиток і переїхати до Словаччини",
                "Відповіді на запитання учасників у прямому ефірі",
              ].map((item) => (
                <li key={item} className="flex items-baseline gap-3">
                  <span className="shrink-0 -translate-y-0.5 text-[#E6308A]" aria-hidden>
                    ✔️
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Image
            src="/webinar/hero.jpg"
            alt="Студенти VIPSTUDY біля університету Костянтина Філософа в Нітрі"
            width={700}
            height={525}
            priority
            className="h-[200px] w-full animate-wb-float rounded-2xl object-cover shadow-[0_16px_40px_rgba(35,40,90,0.14)] min-[480px]:h-[280px] min-[821px]:h-[440px] min-[821px]:shadow-[0_24px_60px_rgba(35,40,90,0.12)]"
          />
        </section>

        {/* How to enter */}
        <section
          id="how"
          className="relative overflow-hidden bg-gradient-to-b from-[#FFF7FB] to-[#FCE4F0]"
        >
          <Image
            src="/webinar/chevrons.png"
            alt=""
            width={690}
            height={650}
            aria-hidden
            className="pointer-events-none absolute top-2 right-0 w-[150px] opacity-30 min-[480px]:w-[220px] min-[821px]:top-10 min-[821px]:w-[640px] min-[821px]:opacity-90"
          />
          <div className="relative mx-auto max-w-[1280px] px-5 py-12 min-[480px]:px-6 min-[821px]:px-8 min-[821px]:py-[88px]">
            <svg width="490" height="46" viewBox="0 0 490 46" fill="none" className="mb-6 block w-[70%] min-[821px]:mb-14 min-[821px]:w-[490px]">
              <path
                d="M8 30 Q23 8 38 22 T68 22 T98 22 T128 22 T158 22 T188 22 T218 22 T248 22 T278 22 T308 22 T338 22 T368 22 T398 22 T428 22 T458 22"
                stroke="#D6146F"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <h2 className={`${MONTSERRAT} mb-3 text-[22px] leading-[1.3] font-extrabold text-[#23285A] uppercase min-[480px]:text-[26px] min-[821px]:mb-4 min-[821px]:text-[40px] min-[821px]:leading-normal`}>
              Як вступити на бюджет
            </h2>
            <p className="mb-7 text-base leading-[1.4] font-medium tracking-[.02em] text-[#474C6B] uppercase min-[480px]:text-lg min-[821px]:mb-9 min-[821px]:text-2xl">
              До державних університетів Словаччини?
            </p>
            <div className="mb-5 flex items-center gap-3 min-[821px]:mb-6 min-[821px]:gap-3.5">
              <Image src="/webinar/icon-no-exam.png" alt="" width={36} height={36} className="h-6 w-6 shrink-0 min-[821px]:h-[30px] min-[821px]:w-[30px]" />
              <span className="text-base font-bold text-[#E6308A] min-[821px]:text-[19px]">Без НМТ та вступних іспитів</span>
            </div>
            <p className="mb-6 max-w-[560px] text-[15px] leading-[1.6] font-medium text-[#23285A] min-[821px]:mb-7 min-[821px]:text-lg min-[821px]:leading-[1.7]">
              На <span className="font-bold text-[#E6308A]">безкоштовному вебінарі</span> ви дізнаєтеся все про
              вступ у <span className="font-bold text-[#E6308A]">2027 році</span> — від вибору університету до
              успішного зарахування.
            </p>
            <div className="mb-9 flex items-center gap-3 min-[821px]:mb-11 min-[821px]:gap-3.5">
              <Image src="/webinar/icon-gift.png" alt="" width={38} height={38} className="h-7 w-7 shrink-0 min-[821px]:h-8 min-[821px]:w-8" />
              <span className="text-base font-bold text-[#23285A] min-[821px]:text-lg">
                Лише для учасників вебінару — спеціальні акції та бонуси цього місяця
              </span>
            </div>
            <a
              href="#register"
              className="inline-block w-full rounded-[10px] bg-[#F0158C] px-[52px] py-4 text-center text-sm font-bold tracking-[.12em] text-white uppercase shadow-[0_14px_30px_rgba(240,21,140,0.35)] transition-transform hover:bg-[#C11367] active:scale-[0.98] min-[480px]:w-auto min-[821px]:py-[18px]"
            >
              Зареєструватись
            </a>
          </div>
        </section>

        {/* Program */}
        <section id="program" className="mx-auto max-w-[1280px] px-5 pt-12 pb-12 min-[480px]:px-6 min-[821px]:px-8 min-[821px]:pt-28 min-[821px]:pb-16">
          <div className="mx-auto max-w-[900px] rounded-2xl border-2 border-[#E6308A] px-5 pt-8 pb-9 min-[480px]:px-8 min-[821px]:rounded-3xl min-[821px]:px-16 min-[821px]:pt-14 min-[821px]:pb-16">
            <Image src="/webinar/icon-program.png" alt="" width={120} height={115} className="mb-5 block h-auto w-14 min-[821px]:mb-6 min-[821px]:w-[88px]" />
            <h2 className={`${MONTSERRAT} mb-7 text-[22px] leading-[1.3] font-extrabold text-[#23285A] uppercase min-[480px]:text-[26px] min-[821px]:mb-10 min-[821px]:text-[36px] min-[821px]:leading-normal`}>
              Програма вебінару:
            </h2>
            <ol className="grid list-none gap-5 p-0 min-[821px]:gap-[26px]">
              {[
                "Чому Словаччина — один із найкращих варіантів для навчання в Європі",
                "Як обрати університет і спеціальність, які підійдуть саме вам",
                "Як вступити без НМТ та вступних іспитів",
                "Які документи потрібні та як не пропустити важливі дедлайни",
                "Скільки коштує навчання, проживання та студентське життя у Словаччині",
                "Покроковий план вступу: від першої заявки до зарахування",
                "Відповіді на найпоширеніші запитання та живе спілкування з експертами",
                "Спеціальні акції та бонуси для учасників вебінару",
              ].map((item, i) => (
                <li key={item} className="flex items-baseline gap-4 min-[821px]:gap-[22px]">
                  <span className={`${MONTSERRAT} min-w-[20px] shrink-0 text-xl font-extrabold text-[#E6308A] min-[821px]:min-w-[22px] min-[821px]:text-[26px]`}>
                    {i + 1}
                  </span>
                  <span className="text-[15px] leading-[1.4] font-semibold text-[#23285A] min-[821px]:text-[19px] min-[821px]:leading-normal">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Registration */}
        <section id="register" className="relative mx-auto max-w-[1280px] px-5 pt-8 pb-12 min-[480px]:px-6 min-[821px]:px-8 min-[821px]:pt-16 min-[821px]:pb-[120px]">
          <svg
            width="340"
            height="110"
            viewBox="0 0 400 120"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute top-[280px] left-0 max-[820px]:hidden"
          >
            <path d="M10 90 Q120 20 230 60 Q290 82 350 55" stroke="#E6308A" strokeWidth="9" strokeLinecap="round" fill="none" />
            <path d="M320 35 L356 54 L326 80" stroke="#E6308A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <svg
            width="480"
            height="170"
            viewBox="0 0 480 170"
            fill="none"
            aria-hidden
            className="pointer-events-none absolute right-[-20px] bottom-5 max-[820px]:hidden"
          >
            <path
              d="M10 40 Q150 20 240 55 Q300 78 280 115 Q255 155 210 125 Q175 95 235 70 Q330 35 440 120"
              stroke="#E6308A"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />
            <path d="M430 75 L444 124 L396 132" stroke="#E6308A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div className="mx-auto max-w-[1180px] rounded-2xl bg-[#FDECF4] px-5 pt-9 pb-10 text-center min-[480px]:px-8 min-[821px]:rounded-3xl min-[821px]:px-20 min-[821px]:pt-[72px] min-[821px]:pb-20">
            <h2 className={`${MONTSERRAT} mb-4 text-xl leading-[1.35] font-extrabold text-[#23285A] uppercase min-[480px]:text-2xl min-[821px]:mb-5 min-[821px]:text-[32px] min-[821px]:leading-[1.4]`}>
              Зареєструйтеся на вебінар
              <br />
              та отримайте спеціальні бонуси для учасників
            </h2>
            <p className="mx-auto mb-7 max-w-[560px] text-[15px] leading-[1.5] font-medium text-[#474C6B] min-[480px]:text-base min-[821px]:mb-10 min-[821px]:text-lg">
              Заповніть форму — ми надішлемо посилання на вебінар та розповімо про всі акції цього місяця.
            </p>
            <WebinarRegisterForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-8 px-5 py-10 min-[480px]:px-6 min-[821px]:flex-row min-[821px]:gap-12 min-[821px]:px-8 min-[821px]:py-12">
          <div>
            <a href="#top" className="mb-7 inline-flex items-center min-[821px]:mb-8">
              <Image src="/webinar/logo-footer.png" alt="VIPSTUDY" width={96} height={100} className="h-14 w-auto min-[821px]:h-[72px]" />
            </a>
            <div className="grid gap-3.5 text-[15px] font-medium min-[821px]:gap-[18px] min-[821px]:text-base">
              {FOOTER_PHONES.map((p) => (
                <a key={p} href={`tel:${p}`} className="text-white hover:text-[#E6308A]">
                  {formatPhone(p)}
                </a>
              ))}
            </div>
            <div className="mt-8 flex gap-6 min-[821px]:mt-9 min-[821px]:gap-7">
              <a href="#" aria-label="Facebook" className="flex text-white hover:text-[#E6308A]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.3-.04-1.3-.12-2.45-.12-2.4 0-4.05 1.5-4.05 4.2v2.3H7.5V13h2.7v8h3.3z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex text-white hover:text-[#E6308A]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.48 2.5 2.5 0 0 1 4.98 3.5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v6.46h-4v-5.73c0-1.37-.02-3.13-1.9-3.13-1.9 0-2.2 1.49-2.2 3.03v5.83h-4v-11z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="flex text-white hover:text-[#E6308A]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="flex text-white hover:text-[#E6308A]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.6 3c.36 2 1.6 3.4 3.9 3.55v3.05c-1.4.14-2.63-.32-3.9-1.18v5.9c0 4.05-3.02 6.06-6.05 5.6-2.6-.4-4.55-2.66-4.55-5.26 0-3.1 2.6-5.5 5.9-5.28v3.13c-.3-.05-.6-.06-.9 0-1.2.24-2 1.15-2 2.35 0 1.36 1.15 2.4 2.5 2.35 1.3-.05 2.1-1.02 2.1-2.5V3h3z" />
                </svg>
              </a>
            </div>
          </div>
          <div className="self-start text-[15px] text-white min-[821px]:self-end">
            <span>Розробили сайт </span>
            <a href="https://steck.top/" target="_blank" rel="noopener" className="font-bold text-[#E6308A] hover:text-white">
              СТЕК.
            </a>
          </div>
        </div>
      </footer>

      {/* Pinned mobile CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#F1D6E6] bg-white/95 px-5 pt-3 shadow-[0_-8px_24px_rgba(35,40,90,0.14)] backdrop-blur-sm min-[821px]:hidden"
        style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
      >
        <a
          href="#register"
          className="block w-full rounded-[10px] bg-[#F0158C] py-3.5 text-center text-[13px] font-bold tracking-[.1em] text-white uppercase shadow-[0_10px_24px_rgba(240,21,140,0.3)] transition-transform active:scale-[0.98] active:bg-[#C11367]"
        >
          Зареєструватись
        </a>
      </div>
    </div>
  );
}
