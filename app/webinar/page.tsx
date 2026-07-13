import Image from "next/image";
import { getSection } from "@/lib/admin-data";
import { formatWebinarDate } from "@/lib/webinar";
import { WebinarCountdown } from "@/components/webinar/countdown";
import { WebinarRegisterForm } from "@/components/webinar/register-form";

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
    <div className="flex min-h-full flex-col bg-white text-[#474C6B]">
      {/* Header */}
      <header className="bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-[18px] px-8 py-5 min-[821px]:flex-row min-[821px]:gap-10">
          <a href="#top" className="flex shrink-0 items-center">
            <Image src="/webinar/logo.png" alt="VIPSTUDY" width={96} height={96} className="h-[72px] w-auto" />
          </a>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] font-semibold whitespace-nowrap min-[821px]:grid-cols-[auto_auto] min-[821px]:grid-flow-col min-[821px]:gap-x-8">
            {HEADER_PHONES.map((p) => (
              <a key={p} href={`tel:${p}`} className="text-[#E6308A]">
                {formatPhone(p)}
              </a>
            ))}
          </div>
          <nav className="flex w-full flex-col items-center gap-3.5 min-[821px]:w-auto min-[821px]:flex-row min-[821px]:gap-7">
            <a
              href="#how"
              className="text-[15px] font-semibold whitespace-nowrap tracking-[.04em] text-[#23285A] uppercase hover:text-[#E6308A]"
            >
              Як вступити?
            </a>
            <a
              href="#program"
              className="text-[15px] font-semibold whitespace-nowrap tracking-[.04em] text-[#23285A] uppercase hover:text-[#E6308A]"
            >
              Програма вебінару
            </a>
            <a
              href="#register"
              className="w-full rounded-[10px] bg-[#F0158C] px-7 py-3.5 text-center text-[13px] font-bold tracking-[.1em] text-white uppercase shadow-[0_10px_24px_rgba(240,21,140,0.3)] hover:bg-[#C11367] min-[821px]:w-auto"
            >
              Зареєструватись
            </a>
          </nav>
        </div>
      </header>

      {/* Countdown ticker */}
      <div className="overflow-hidden bg-gradient-to-r from-[#F0158C] to-[#C11367] py-[13px] whitespace-nowrap text-white">
        <div className="inline-flex animate-wb-marquee items-center">
          {[0, 1].map((i) => (
            <span
              key={i}
              aria-hidden={i === 1}
              className="inline-flex items-center gap-11 pr-11 text-[15px] font-extrabold tracking-[.08em] uppercase"
            >
              <span className="inline-flex items-center gap-3">
                <span className="inline-block h-2.5 w-2.5 animate-wb-pulse rounded-full bg-white" />
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
          className="mx-auto grid max-w-[1280px] scroll-mt-6 grid-cols-1 items-center gap-8 px-8 py-16 min-[821px]:grid-cols-[1fr_1.15fr] min-[821px]:gap-[72px] min-[821px]:py-24"
        >
          <div>
            <h1 className={`${MONTSERRAT} mb-7 text-[30px] leading-[1.25] font-extrabold text-[#23285A] uppercase min-[821px]:text-[46px]`}>
              Безкоштовний вебінар від VIPSTUDY
            </h1>
            <p className="mb-8 text-lg font-bold text-[#E6308A] min-[821px]:text-[22px]">
              Прямий ефір відбудеться {dateText}
            </p>
            <ul className="grid list-none gap-4 p-0 text-base font-medium text-[#23285A] min-[821px]:text-lg">
              {[
                "Як гарантовано вступити на бюджет до ВНЗ Словаччини",
                "Без ЗНО та вступних іспитів",
                "Без мовного підтвердження",
                "Усі кроки та деталі вступу",
              ].map((item) => (
                <li key={item} className="flex items-baseline gap-3.5">
                  <span className="h-[9px] w-[9px] shrink-0 -translate-y-0.5 rounded-full bg-[#E6308A]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Image
            src="/webinar/hero.png"
            alt="Студенти VIPSTUDY біля університету Костянтина Філософа в Нітрі"
            width={700}
            height={545}
            className="h-[260px] w-full animate-wb-float rounded-2xl object-cover shadow-[0_24px_60px_rgba(35,40,90,0.12)] min-[821px]:h-[440px]"
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
            className="pointer-events-none absolute top-3 right-0 w-[300px] opacity-45 min-[821px]:top-10 min-[821px]:w-[640px] min-[821px]:opacity-90"
          />
          <div className="relative mx-auto max-w-[1280px] px-8 py-16 min-[821px]:py-[88px]">
            <svg width="490" height="46" viewBox="0 0 490 46" fill="none" className="mb-8 block w-[78%] min-[821px]:mb-14 min-[821px]:w-[490px]">
              <path
                d="M8 30 Q23 8 38 22 T68 22 T98 22 T128 22 T158 22 T188 22 T218 22 T248 22 T278 22 T308 22 T338 22 T368 22 T398 22 T428 22 T458 22"
                stroke="#D6146F"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <h2 className={`${MONTSERRAT} mb-4 text-[26px] font-extrabold text-[#23285A] uppercase min-[821px]:text-[40px]`}>
              Як вступити на бюджет
            </h2>
            <p className="mb-9 text-lg font-medium tracking-[.02em] text-[#474C6B] uppercase min-[821px]:text-2xl">
              У словацькі державні університети
            </p>
            <div className="mb-6 flex items-center gap-3.5">
              <Image src="/webinar/icon-no-exam.png" alt="" width={36} height={36} className="h-[30px] w-[30px]" />
              <span className="text-[19px] font-bold text-[#E6308A]">Без ЗНО та вступних іспитів</span>
            </div>
            <p className="mb-7 max-w-[560px] text-lg leading-[1.7] font-medium text-[#23285A]">
              Всі деталі вступу на <span className="font-bold text-[#E6308A]">БЕЗКОШТОВНОМУ ВЕБІНАРІ</span> для
              абітурієнтів та батьків вже <span className="font-bold text-[#E6308A]">{dateText}</span>
            </p>
            <div className="mb-11 flex items-center gap-3.5">
              <Image src="/webinar/icon-gift.png" alt="" width={38} height={38} className="h-8 w-8" />
              <span className="text-lg font-bold text-[#23285A]">Розіграш призів у прямому ефірі</span>
            </div>
            <a
              href="#register"
              className="inline-block rounded-[10px] bg-[#F0158C] px-[52px] py-[18px] text-sm font-bold tracking-[.12em] text-white uppercase shadow-[0_14px_30px_rgba(240,21,140,0.35)] hover:bg-[#C11367]"
            >
              Зареєструватись
            </a>
          </div>
        </section>

        {/* Program */}
        <section id="program" className="mx-auto max-w-[1280px] px-8 pt-16 pb-16 min-[821px]:pt-28">
          <div className="mx-auto max-w-[900px] rounded-3xl border-2 border-[#E6308A] px-6 pt-9 pb-10 min-[821px]:px-16 min-[821px]:pt-14 min-[821px]:pb-16">
            <Image src="/webinar/icon-program.png" alt="" width={120} height={115} className="mb-6 block h-auto w-[70px] min-[821px]:w-[88px]" />
            <h2 className={`${MONTSERRAT} mb-10 text-[28px] font-extrabold text-[#23285A] uppercase min-[821px]:text-[36px]`}>
              Програма вебінару:
            </h2>
            <ol className="grid list-none gap-[26px] p-0">
              {[
                "Чому варто обрати саме Словаччину",
                "Як правильно підібрати спеціальність",
                "Як за декілька місяців зрозуміти словацьку мову",
                "Які витрати планувати на вступну кампанію",
                "Скільки коштує життя студента в Словаччині",
                "Усі кроки та деталі гарантованого вступу до університетів на бюджет",
                "Відповіді на запитання в прямому ефірі",
                "Приємні бонуси учасникам вебінару",
              ].map((item, i) => (
                <li key={item} className="flex items-baseline gap-[22px]">
                  <span className={`${MONTSERRAT} min-w-[22px] text-2xl font-extrabold text-[#E6308A] min-[821px]:text-[26px]`}>
                    {i + 1}
                  </span>
                  <span className="text-base font-semibold text-[#23285A] min-[821px]:text-[19px]">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Registration */}
        <section id="register" className="relative mx-auto max-w-[1280px] px-8 pt-10 pb-16 min-[821px]:pt-16 min-[821px]:pb-[120px]">
          <div className="relative mx-auto max-w-[1180px] rounded-3xl bg-[#FDECF4] px-6 pt-11 pb-12 text-center min-[821px]:px-20 min-[821px]:pt-[72px] min-[821px]:pb-20">
            <h2 className={`${MONTSERRAT} mb-10 text-2xl leading-[1.4] font-extrabold text-[#23285A] uppercase min-[821px]:text-[32px]`}>
              Пройди безкоштовну реєстрацію
              <br />
              та отримай подарунок
            </h2>
            <WebinarRegisterForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-[34px] px-8 py-12 min-[821px]:flex-row min-[821px]:gap-12">
          <div>
            <a href="#top" className="mb-8 inline-flex items-center">
              <Image src="/webinar/logo-footer.png" alt="VIPSTUDY" width={96} height={100} className="h-[72px] w-auto" />
            </a>
            <div className="grid gap-[18px] text-base font-medium">
              {FOOTER_PHONES.map((p) => (
                <a key={p} href={`tel:${p}`} className="text-white hover:text-[#E6308A]">
                  {formatPhone(p)}
                </a>
              ))}
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
    </div>
  );
}
