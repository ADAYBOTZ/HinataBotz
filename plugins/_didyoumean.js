import didyoumean from 'didyoumean'
import similarity from 'similarity'
export async function before(m, { conn, match, usedPrefix }) {
	if ((usedPrefix = (match[0] || '')[0])) {
		let noPrefix = m.text.replace(usedPrefix, '')
		let args = noPrefix.trim().split` `.slice(1)
		let text = args.join` `
		let help = Object.values(plugins).filter(v => v.help && !v.disabled).map(v => v.help).flat(1)
		if (help.includes(noPrefix)) return
		let mean = didyoumean(noPrefix, help)
		let sim = similarity(noPrefix, help)
		let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)
    let caption = `👋 Hai *${name} @${who.split("@")[0]}*\nApakah yang kamu maksud: *${usedPrefix + mean}*\nSimilarity: *${sim}*`
		if (mean) conn.sendButton(m.chat, caption, wm, null, [['✅ Iya', `${usedPrefix + mean} ${text}`], ['❌ Bukan', usedPrefix + '?']], m, { mentions: conn.parseMention(caption) })
	}
}
export const disabled = false
