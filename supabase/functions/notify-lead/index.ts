// Supabase Edge Function: notify-lead
// Disparada por Database Webhook quando um novo lead é inserido em leads_aceleracao.
// Envia uma mensagem no WhatsApp via Stevo.

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const r = payload.record ?? {};

    const STEVO_URL    = Deno.env.get("STEVO_URL")!;     // ex: https://smv2-8.stevo.chat
    const STEVO_KEY    = Deno.env.get("STEVO_API_KEY")!; // ex: 1769836519293fRvOnazfAzj4wi2q
    const STEVO_NUMBER = Deno.env.get("STEVO_NUMBER")!;  // ex: 553497285143

    const fmt = (label: string, val: unknown) =>
      val ? `*${label}:* ${val}\n` : "";

    const text =
      `🚀 *Novo lead — Aceleração com IA*\n\n` +
      fmt("Nome", r.nome) +
      fmt("E-mail", r.email) +
      fmt("WhatsApp", r.whatsapp) +
      fmt("Instagram", r.instagram) +
      `\n` +
      fmt("O que faz", r.o_que_faz) +
      fmt("Tempo de trabalho", r.tempo_trabalho) +
      fmt("Tamanho empresa", r.tamanho_empresa) +
      fmt("Tamanho time", r.tamanho_time) +
      `\n` +
      fmt("IA no dia a dia", r.ia_dia_a_dia) +
      fmt("Maturidade IA", r.maturidade_ia) +
      fmt("Ferramentas IA", r.ferramentas_ia) +
      fmt("Travamentos", r.travamentos) +
      `\n` +
      fmt("O que vende", r.o_que_vende) +
      fmt("Problema 30 dias", r.problema_30_dias) +
      fmt("Sucesso 8 semanas", r.sucesso_8_semanas) +
      fmt("Como conheceu", r.como_conheceu) +
      fmt("Info adicional", r.info_adicional) +
      `\n` +
      `🎯 *Qualificação*\n` +
      fmt("Disponibilidade", r.disponibilidade) +
      fmt("Investimento", r.investimento) +
      fmt("Quer cursos", r.quer_cursos);

    const stevoRes = await fetch(`${STEVO_URL}/send/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": STEVO_KEY,
      },
      body: JSON.stringify({
        delay: 1,
        formatJid: true,
        number: STEVO_NUMBER,
        text,
      }),
    });

    const body = await stevoRes.text();
    if (!stevoRes.ok) {
      console.error("Stevo error", stevoRes.status, body);
      return new Response(JSON.stringify({ ok: false, status: stevoRes.status, body }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500 });
  }
});
