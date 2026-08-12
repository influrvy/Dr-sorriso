"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const LEADS_API = "https://influrbusiness.com.br/api/public/leads";
const APPOINTMENTS_API = "https://influrbusiness.com.br/api/public/appointments";
const CHECKOUT_URL = "https://influrbusiness.com.br/comprar";
const SITE_KEY = process.env.NEXT_PUBLIC_INFLUR_SITE_KEY ?? "";
const ORGANIZATION = process.env.NEXT_PUBLIC_INFLUR_ORGANIZATION ?? "";

const treatments = [
  ["Clínica geral", "Prevenção, check-up, restaurações e cuidado contínuo para toda a família."],
  ["Próteses dentárias", "Recupere função, conforto e confiança com soluções planejadas para você."],
  ["Implantes", "Planejamento seguro para repor dentes perdidos e devolver liberdade ao sorrir."],
  ["Ortodontia", "Alinhamento dental com acompanhamento próximo em todas as fases do tratamento."],
  ["Estética dental", "Clareamento e soluções estéticas para um sorriso natural e harmônico."],
  ["Harmonização", "Procedimentos faciais que valorizam seus traços com equilíbrio e responsabilidade."],
];

const steps = [
  ["01", "Escuta e avaliação", "Entendemos o que você sente e o resultado que deseja."],
  ["02", "Plano transparente", "Você conhece as possibilidades, etapas e cuidados antes de começar."],
  ["03", "Tratamento", "Técnica, conforto e atenção em cada encontro."],
  ["04", "Acompanhamento", "Continuamos perto para proteger seu novo sorriso."],
];

type SubmitState = "idle" | "loading" | "success" | "error";

function integrationContext() {
  return {
    site_key: SITE_KEY,
    organization: ORGANIZATION,
    domain: typeof window !== "undefined" ? window.location.hostname : "",
    page_url: typeof window !== "undefined" ? window.location.href : "",
    source: "site-dr-sorriso-santa-tereza",
  };
}

async function postToInflur(endpoint: string, form: HTMLFormElement) {
  if (!SITE_KEY) throw new Error("Site ainda não configurado.");
  const fields = Object.fromEntries(new FormData(form).entries());
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...fields, ...integrationContext() }),
  });
  if (!response.ok) throw new Error("Não foi possível enviar.");
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadState, setLeadState] = useState<SubmitState>("idle");
  const [appointmentState, setAppointmentState] = useState<SubmitState>("idle");
  const checkoutHref = useMemo(() => {
    const query = new URLSearchParams({ origem: "dr-sorriso-santa-tereza" });
    if (SITE_KEY) query.set("site_key", SITE_KEY);
    if (ORGANIZATION) query.set("organization", ORGANIZATION);
    return `${CHECKOUT_URL}?${query}`;
  }, []);

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>(".signature-cursor");
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;
    const move = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("is-visible");
    };
    const press = () => cursor.classList.add("is-pressed");
    const release = () => cursor.classList.remove("is-pressed");
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerdown", press); window.removeEventListener("pointerup", release); };
  }, []);

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLeadState("loading");
    try {
      await postToInflur(LEADS_API, event.currentTarget);
      event.currentTarget.reset();
      setLeadState("success");
    } catch {
      setLeadState("error");
    }
  }

  async function submitAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppointmentState("loading");
    try {
      await postToInflur(APPOINTMENTS_API, event.currentTarget);
      event.currentTarget.reset();
      setAppointmentState("success");
    } catch {
      setAppointmentState("error");
    }
  }

  return (
    <>
      <div className="signature-cursor" aria-hidden="true"><i /></div>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Dr. Sorriso — início">
          <span className="brand-mark">DS</span>
          <span><strong>DR. SORRISO</strong><small>ODONTOLOGIA ESTÉTICA</small></span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Abrir menu">{menuOpen ? "×" : "☰"}</button>
        <nav className={menuOpen ? "nav open" : "nav"} onClick={() => setMenuOpen(false)}>
          <a href="#clinica">A clínica</a><a href="#tratamentos">Tratamentos</a><a href="#estrutura">Estrutura</a><a href="#localizacao">Localização</a>
        </nav>
        <a className="button button-small header-cta" href="#agendamento">Agendar avaliação</a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy reveal">
            <p className="eyebrow">Santa Tereza · Boa Vista, RR</p>
            <h1>Seu sorriso merece <em>cuidado de verdade.</em></h1>
            <p className="hero-text">Odontologia completa e estética com escuta, segurança e um plano feito para devolver sua confiança.</p>
            <div className="hero-actions"><a className="button" href="#agendamento">Quero cuidar do meu sorriso</a><a className="text-link" href="https://api.whatsapp.com/send/?phone=5595991505132" target="_blank" rel="noreferrer">Falar no WhatsApp ↗</a></div>
            <div className="hero-proof"><span><b>EPAO 0246</b>Clínica regularizada</span><span><b>CRO-RR 01400</b>Responsável técnico</span></div>
          </div>
          <div className="hero-visual">
            <img src="/clinic/1539549927c76f4e.jpg" alt="Atendimento odontológico na clínica Dr. Sorriso" />
            <div className="hero-badge"><span>✦</span><b>Atendimento humano</b><small>do diagnóstico ao pós-tratamento</small></div>
          </div>
        </section>

        <section className="promise-strip" aria-label="Diferenciais"><span>✦ Cuidado próximo</span><span>✦ Odontologia completa</span><span>✦ Ambiente acolhedor</span><span>✦ Planejamento transparente</span></section>

        <section className="section intro" id="clinica">
          <div className="section-heading"><p className="eyebrow">A clínica</p><h2>Uma experiência que começa antes da cadeira.</h2></div>
          <div className="intro-content"><p className="large-copy">Acreditamos que um bom tratamento começa quando você se sente ouvido. Por isso, cada detalhe foi pensado para trazer tranquilidade, clareza e confiança.</p><div className="stats"><div><b>7,6 mil+</b><span>pessoas acompanham nosso trabalho</span></div><div><b>Completa</b><span>saúde e estética no mesmo lugar</span></div><div><b>Santa Tereza</b><span>perto de você em Boa Vista</span></div></div></div>
        </section>

        <section className="section treatments" id="tratamentos">
          <div className="section-heading center"><p className="eyebrow">Tratamentos</p><h2>Seu sorriso cuidado por inteiro.</h2><p>Da prevenção à transformação, encontre o cuidado certo para o seu momento.</p></div>
          <div className="treatment-grid">{treatments.map(([title, text], index) => <article key={title}><span className="treatment-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p><a href="#agendamento">Agendar avaliação <span>↗</span></a></article>)}</div>
        </section>

        <section className="section feature" id="estrutura">
          <div className="feature-images"><img className="feature-main" src="/clinic/6b501f70d9ee2d6c.jpg" alt="Equipamento odontológico da clínica" /><img className="feature-side" src="/clinic/f391207b6b741cce.jpg" alt="Fachada da clínica Dr. Sorriso" /></div>
          <div className="feature-copy"><p className="eyebrow">Estrutura & segurança</p><h2>Tecnologia que cuida. Ambiente que acolhe.</h2><p>Uma clínica preparada para oferecer diagnósticos cuidadosos e procedimentos seguros, sem perder o que mais importa: o olhar humano.</p><ul><li><span>01</span><div><b>Avaliação detalhada</b><small>Planejamento individual, explicado com clareza.</small></div></li><li><span>02</span><div><b>Biossegurança</b><small>Protocolos rigorosos em todos os atendimentos.</small></div></li><li><span>03</span><div><b>Conforto em cada etapa</b><small>Equipe atenta para uma experiência mais tranquila.</small></div></li></ul></div>
        </section>

        <section className="section journey">
          <div className="section-heading"><p className="eyebrow">Sua jornada</p><h2>Simples, transparente e no seu ritmo.</h2></div>
          <div className="steps">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="section smile-showcase">
          <div><p className="eyebrow">Confiança para sorrir</p><h2>O resultado mais bonito é você se sentir bem.</h2><p>Tratamentos que respeitam sua individualidade, preservam a naturalidade e ajudam você a sorrir sem se esconder.</p><a className="button button-light" href="#agendamento">Começar minha transformação</a></div>
          <div className="showcase-grid"><img src="/clinic/ee241ad5e09aec8e.jpg" alt="Planejamento de prótese dentária" /><img src="/clinic/4262a5b8da8ebca0.jpg" alt="Conteúdo de saúde bucal da Dr. Sorriso" /></div>
        </section>

        <section className="section appointment" id="agendamento">
          <div className="appointment-copy"><p className="eyebrow">Agendamento online</p><h2>Escolha quando quer começar.</h2><p>Envie sua solicitação. Nossa equipe confirma o melhor horário pelo WhatsApp.</p><div className="contact-note"><b>Prefere falar agora?</b><a href="https://api.whatsapp.com/send/?phone=5595991505132" target="_blank" rel="noreferrer">(95) 99150-5132 ↗</a></div></div>
          <form className="form-card" onSubmit={submitAppointment}>
            <div className="form-title"><span>01</span><div><b>Solicite seu horário</b><small>Leva menos de 1 minuto</small></div></div>
            <label>Nome completo<input name="name" required autoComplete="name" placeholder="Como podemos chamar você?" /></label>
            <div className="form-row"><label>WhatsApp<input name="phone" required inputMode="tel" autoComplete="tel" placeholder="(95) 99999-9999" /></label><label>E-mail<input name="email" required type="email" autoComplete="email" placeholder="voce@email.com" /></label></div>
            <label>O que você procura?<select name="service" required defaultValue=""><option value="" disabled>Selecione um tratamento</option>{treatments.map(([title]) => <option key={title}>{title}</option>)}<option>Outro / Ainda não sei</option></select></label>
            <div className="form-row"><label>Melhor data<input name="date" required type="date" /></label><label>Período<select name="period" required defaultValue=""><option value="" disabled>Selecione</option><option>Manhã</option><option>Tarde</option></select></label></div>
            <label>Conte brevemente (opcional)<textarea name="message" rows={3} placeholder="Como podemos ajudar?" /></label>
            <button className="button form-button" disabled={appointmentState === "loading"}>{appointmentState === "loading" ? "Enviando..." : "Solicitar agendamento"}</button>
            {appointmentState === "success" && <p className="form-status success">Recebemos sua solicitação. A equipe entrará em contato!</p>}{appointmentState === "error" && <p className="form-status error">Não foi possível enviar. Fale com a equipe pelo WhatsApp.</p>}
            <small className="privacy">Ao enviar, você concorda em receber nosso contato sobre esta solicitação.</small>
          </form>
        </section>

        <section className="section social">
          <div className="social-heading"><p className="eyebrow">@drsorrisorr.santatereza</p><h2>Acompanhe nosso dia a dia.</h2><a href="https://www.instagram.com/drsorrisorr.santatereza/" target="_blank" rel="noreferrer">Ver no Instagram ↗</a></div>
          <div className="social-grid">{["c0d8f07fccb4a91c","bf74d3defbe09785","61c844a59631e370","0d681d2ea311a960"].map((image, index) => <a href="https://www.instagram.com/drsorrisorr.santatereza/" target="_blank" rel="noreferrer" key={image}><img src={`/clinic/${image}.jpg`} alt={`Publicação da clínica Dr. Sorriso ${index + 1}`} /><span>↗</span></a>)}</div>
        </section>

        <section className="section location" id="localizacao">
          <div className="location-card"><p className="eyebrow">Onde estamos</p><h2>Venha conhecer a Dr. Sorriso.</h2><address>Av. Princesa Isabel, 3873<br />Santa Tereza · Boa Vista, RR</address><div className="hours"><span>Segunda a sexta<small>Consulte horários</small></span><span>Agendamentos<small>(95) 99150-5132</small></span></div><a className="button" href="https://maps.app.goo.gl/YvbXhs6HurVusD9S8" target="_blank" rel="noreferrer">Traçar rota no Maps ↗</a></div>
          <div className="map-frame"><div className="map-label"><span>Street view</span><b>Conheça a nossa entrada</b><small>Av. Princesa Isabel, 3873</small></div><div className="map-orbit map-orbit-one" /><div className="map-orbit map-orbit-two" /><iframe src="https://www.google.com/maps/embed?pb=!4v1786560065362!6m8!1m7!1s81zbaYsTDZ3ww39Dn_8GFA!2m2!1d2.83089373480938!2d-60.73064131405891!3f154.23880258130066!4f-1.2061270849748382!5f1.925732226890613" title="Street View da clínica Dr. Sorriso" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
        </section>

        <section className="section lead-section">
          <div><p className="eyebrow">Ainda tem dúvidas?</p><h2>Vamos conversar sobre o seu sorriso.</h2><p>Deixe seus dados e nossa equipe entra em contato para orientar o próximo passo.</p></div>
          <form className="lead-form" onSubmit={submitLead}><label><span>Seu nome</span><input name="name" required autoComplete="name" placeholder="Nome completo" /></label><label><span>Seu melhor contato</span><input name="phone" required autoComplete="tel" placeholder="WhatsApp" /></label><label><span>Seu e-mail</span><input name="email" required type="email" autoComplete="email" placeholder="E-mail" /></label><button className="button button-light" disabled={leadState === "loading"}>{leadState === "loading" ? "Enviando..." : "Quero receber contato"}</button>{leadState === "success" && <p className="form-status success">Pronto! Em breve falaremos com você.</p>}{leadState === "error" && <p className="form-status error">Não foi possível enviar agora. Tente pelo WhatsApp.</p>}</form>
        </section>
      </main>

      <footer><div className="footer-brand"><span className="brand-mark">DS</span><div><b>DR. SORRISO</b><small>Odontologia Estética</small></div></div><div><b>Atendimento</b><a href="#agendamento">Agendamento online</a><a href="https://api.whatsapp.com/send/?phone=5595991505132">WhatsApp</a></div><div><b>Visite</b><a href="https://maps.app.goo.gl/YvbXhs6HurVusD9S8">Av. Princesa Isabel, 3873<br />Santa Tereza · Boa Vista, RR</a></div><div><b>Acompanhe</b><a href="https://www.instagram.com/drsorrisorr.santatereza/">Instagram ↗</a></div><div className="footer-bottom"><span>© 2026 Dr. Sorriso · EPAO 0246 · Resp. Téc. Ítalo Luís, CRO-RR 01400</span><a className="site-sale" href={checkoutHref} target="_blank" rel="noreferrer">Quero este site ↗</a></div></footer>
      <a className="whatsapp-float" href="https://api.whatsapp.com/send/?phone=5595991505132" target="_blank" rel="noreferrer" aria-label="Falar com a Dr. Sorriso no WhatsApp"><img src="https://cdn.simpleicons.org/whatsapp/F7F6F1" alt="" /></a>
    </>
  );
}
