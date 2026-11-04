'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import type { AgeGroup, Lang } from '@/lib/prefs';

type CaptionCue = { from: number; to: number; en: string; ur: string };
type VideoInfo = {
  provider?: 'youtube' | 'instagram';
  id: string;
  start: number;
  end: number;
  title: string;
  captions: CaptionCue[];
};

const VIDEOS: Record<AgeGroup, VideoInfo> = {
  '12-17': {
    id: 'eVavljXJHa8', start: 0, end: 66, title: 'سلسلة الأمان الرقمي للأطفال',
    captions: [
      { from: 1, to: 14, en: 'Khaled loves playing online, but he does not know that there are some risks. “Hi Khaled, your game looks fun. Can I know your full name and the name of your school?”', ur: 'خالد کو آن لائن کھیلنا بہت پسند ہے، لیکن اسے معلوم نہیں کہ اس میں کچھ خطرات بھی ہیں۔ “ہیلو خالد، تمہارا کھیل مزے کا لگ رہا ہے۔ کیا میں تمہارا پورا نام اور تمہارے اسکول کا نام جان سکتا ہوں؟”' },
      { from: 14, to: 20, en: 'Wait a moment, Khaled. Do you know that this is personal information? Personal information is anything that tells others about you.', ur: 'ایک لمحہ رکو خالد۔ کیا تم جانتے ہو کہ یہ ذاتی معلومات ہیں؟ ذاتی معلومات وہ ہر چیز ہے جو تمہارے بارے میں بتاتی ہے۔' },
      { from: 20, to: 29, en: 'But it should stay private, and you should not tell it to any stranger. If you share your personal information…', ur: 'لیکن اسے خفیہ رہنا چاہیے، اور تمہیں یہ کسی اجنبی کو نہیں بتانا چاہیے۔ اگر تم اپنی ذاتی معلومات شیئر کرو…' },
      { from: 29, to: 37, en: '…a stranger may be able to find you, pretend to be you, bully you, or even steal your account.', ur: '…تو کوئی اجنبی تمہیں ڈھونڈ سکتا ہے، تمہاری شناخت اختیار کر سکتا ہے، تمہیں تنگ کر سکتا ہے، یا تمہارا اکاؤنٹ بھی چرا سکتا ہے۔' },
      { from: 37, to: 43, en: 'Sorry, I do not share my personal information with strangers.', ur: 'معاف کیجیے، میں اپنی ذاتی معلومات اجنبیوں کے ساتھ شیئر نہیں کرتا۔' },
      { from: 43, to: 52, en: 'How can you protect yourself? Do not share your information with strangers. Use strong passwords.', ur: 'آپ خود کو کیسے محفوظ رکھ سکتے ہیں؟ اپنی معلومات اجنبیوں کے ساتھ شیئر نہ کریں۔ مضبوط پاس ورڈ استعمال کریں۔' },
      { from: 52, to: 60, en: 'Check your account privacy settings carefully, and think before you post any information…', ur: 'اپنے اکاؤنٹ کی پرائیویسی سیٹنگز اچھی طرح چیک کریں، اور کوئی بھی معلومات پوسٹ کرنے سے پہلے اچھی طرح سوچیں…' },
      { from: 60, to: 66, en: '…about yourself or your family. This way, you can stay safe.', ur: '…اپنے بارے میں یا اپنے خاندان کے بارے میں۔ اس طرح آپ محفوظ رہ سکتے ہیں۔' },
    ],
  },

  '18-24': {
    id: 'TtcV4jpNG8M', start: 0, end: 48, title: 'الحماية من التصيد الإلكتروني',
    captions: [
      { from: 0, to: 5, en: 'Phishing is a malicious technique used by hackers to break into systems.', ur: 'فِشنگ ایک نقصان دہ طریقہ ہے جسے ہیکرز سسٹمز میں داخل ہونے کے لیے استعمال کرتے ہیں۔' },
      { from: 5, to: 8, en: 'Simply put, they send messages containing harmful links or attachments.', ur: 'آسان الفاظ میں، وہ ایسے پیغامات بھیجتے ہیں جن میں نقصان دہ لنکس یا فائلیں شامل ہوتی ہیں۔' },
      { from: 8, to: 13, en: 'These messages are sent to individuals or companies with the aim of convincing the victim to click the link or open the attachment.', ur: 'یہ پیغامات افراد یا کمپنیوں کو اس مقصد سے بھیجے جاتے ہیں کہ متاثرہ شخص لنک پر کلک کرے یا فائل کھولے۔' },
      { from: 13, to: 19, en: 'If that happens, malicious software may be downloaded onto the device.', ur: 'اگر ایسا ہو جائے تو نقصان دہ سافٹ ویئر ڈیوائس پر ڈاؤن لوڈ ہو سکتا ہے۔' },
      { from: 19, to: 25, en: 'Or your personal information may be exposed through fake websites.', ur: 'یا جعلی ویب سائٹس کے ذریعے آپ کی ذاتی معلومات افشا ہو سکتی ہیں۔' },
      { from: 25, to: 31, en: 'But with advances in technology and artificial intelligence, phishing has become more complex and dangerous.', ur: 'لیکن ٹیکنالوجی اور مصنوعی ذہانت کی ترقی کے ساتھ فِشنگ زیادہ پیچیدہ اور خطرناک ہو گئی ہے۔' },
      { from: 31, to: 38, en: 'Estimates suggest that 32% of cyber breaches involve phishing, and 64% of companies have experienced at least one phishing attempt.', ur: 'اندازوں کے مطابق 32 فیصد سائبر حملوں میں فِشنگ شامل ہوتی ہے، اور 64 فیصد کمپنیوں کو کم از کم ایک بار فِشنگ کی کوشش کا سامنا ہوا ہے۔' },
      { from: 38, to: 44, en: 'To avoid phishing, do not click any link in a message from an unknown source.', ur: 'فِشنگ سے بچنے کے لیے نامعلوم ذریعے سے آنے والے پیغام کے کسی بھی لنک پر کلک نہ کریں۔' },
      { from: 44, to: 48, en: 'Check websites yourself, and be careful of pop-up windows that appear suddenly.', ur: 'ویب سائٹس خود چیک کریں، اور اچانک ظاہر ہونے والی پاپ اَپ ونڈوز سے محتاط رہیں۔' },
    ],
  },

  '25-34': {
    id: 'GYF6yiHo7Rc', start: 0, end: 34, title: 'التوعية بالأمان الرقمي',
    captions: [
      { from: 1, to: 3, en: 'Do you use the Wi-Fi available in public places?', ur: 'کیا آپ عوامی مقامات پر دستیاب وائی فائی استعمال کرتے ہیں؟' },
      { from: 3, to: 7, en: 'Open Wi-Fi networks can be a trap.', ur: 'کھلے وائی فائی نیٹ ورکس ایک جال ہو سکتے ہیں۔' },
      { from: 7, to: 11, en: 'An experiment was carried out on a network at Shanghai Airport.', ur: 'شنگھائی ایئرپورٹ کے نیٹ ورک پر ایک تجربہ کیا گیا۔' },
      { from: 11, to: 14, en: 'A person connected to the airport’s open network.', ur: 'ایک شخص ایئرپورٹ کے کھلے نیٹ ورک سے منسلک ہوا۔' },
      { from: 14, to: 17, en: 'A hacker then exploited the connection to track and hack him.', ur: 'پھر ایک ہیکر نے اس کنکشن کا فائدہ اٹھا کر اس کی نگرانی اور ہیکنگ کی۔' },
      { from: 17, to: 23, en: 'The hacker was able to see his files and the websites he had visited.', ur: 'ہیکر اس کی فائلیں اور وہ ویب سائٹس دیکھنے میں کامیاب ہو گیا جنہیں وہ دیکھ چکا تھا۔' },
      { from: 23, to: 25, en: 'And of course, he obtained his passwords.', ur: 'اور یقیناً، اس نے اس کے پاس ورڈز بھی حاصل کر لیے۔' },
      { from: 25, to: 31, en: 'He was also able to record his voice and capture photos and videos from his device.', ur: 'وہ اس کی آواز ریکارڈ کرنے اور اس کے ڈیوائس سے تصاویر اور ویڈیوز حاصل کرنے میں بھی کامیاب ہو گیا۔' },
      { from: 31, to: 34, en: 'So, do you still trust public Wi-Fi networks?', ur: 'تو کیا آپ اب بھی عوامی وائی فائی نیٹ ورکس پر بھروسا کرتے ہیں؟' },
    ],
  },

  '35-44': {
    id: '8xVDwx5pybA', start: 0, end: 90, title: 'تجنب مصيدة الاحتيال الإلكتروني',
    captions: [
      { from: 0, to: 18, en: 'Awareness tip: If an online offer looks unusually cheap or too good to be true, pause before paying.', ur: 'آگاہی مشورہ: اگر آن لائن پیشکش غیر معمولی طور پر سستی یا حد سے زیادہ اچھی لگے تو ادائیگی سے پہلے رک کر سوچیں۔' },
      { from: 18, to: 36, en: 'Check the website address, seller details, reviews, and return policy before entering payment information.', ur: 'ادائیگی کی معلومات درج کرنے سے پہلے ویب سائٹ کا پتہ، فروخت کنندہ کی تفصیلات، جائزے اور واپسی کی پالیسی چیک کریں۔' },
      { from: 36, to: 54, en: 'Do not pay through a suspicious link or transfer money to an unknown personal account.', ur: 'مشکوک لنک کے ذریعے ادائیگی نہ کریں اور کسی نامعلوم ذاتی اکاؤنٹ میں رقم منتقل نہ کریں۔' },
      { from: 54, to: 72, en: 'Use trusted payment methods and enable transaction notifications whenever possible.', ur: 'قابلِ اعتماد ادائیگی کے طریقے استعمال کریں اور ممکن ہو تو لین دین کی اطلاعات فعال رکھیں۔' },
      { from: 72, to: 90, en: 'If something feels wrong, stop the purchase and verify the seller through an independent source.', ur: 'اگر کچھ مشکوک لگے تو خریداری روک دیں اور فروخت کنندہ کی آزاد ذریعے سے تصدیق کریں۔' },
    ],
  },

  '45-54': {
    id: 'IUCBoBqZbb0', start: 0, end: 36, title: 'الحماية من الاحتيال المالي والاستثماري',
    captions: [
      { from: 0, to: 12, en: 'Awareness tip: Be cautious of investment offers that promise guaranteed or unusually high profits.', ur: 'آگاہی مشورہ: ایسی سرمایہ کاری کی پیشکشوں سے محتاط رہیں جو یقینی یا غیر معمولی طور پر زیادہ منافع کا وعدہ کریں۔' },
      { from: 12, to: 24, en: 'Do not make a financial decision under pressure. Verify the company and investment independently first.', ur: 'دباؤ میں آ کر مالی فیصلہ نہ کریں۔ پہلے کمپنی اور سرمایہ کاری کی آزادانہ طور پر تصدیق کریں۔' },
      { from: 24, to: 36, en: 'Never share banking passwords or verification codes, and stop immediately if anything seems suspicious.', ur: 'بینک پاس ورڈ یا تصدیقی کوڈ کبھی شیئر نہ کریں، اور اگر کچھ مشکوک لگے تو فوراً رک جائیں۔' },
    ],
  },

  '55-64': {
    id: 'lj8Pbqw9peA', start: 0, end: 90, title: 'لا تكن ضحية الاحتيال أو التصيد الإلكتروني',
    captions: [
      { from: 0, to: 18, en: 'Awareness tip: A scammer may impersonate a relative, company, bank, or other trusted person on WhatsApp.', ur: 'آگاہی مشورہ: دھوکے باز واٹس ایپ پر کسی رشتہ دار، کمپنی، بینک یا قابلِ اعتماد شخص کی نقالی کر سکتا ہے۔' },
      { from: 18, to: 36, en: 'Be suspicious if a new number suddenly asks for money, personal information, or urgent help.', ur: 'اگر کوئی نیا نمبر اچانک رقم، ذاتی معلومات یا فوری مدد مانگے تو محتاط ہو جائیں۔' },
      { from: 36, to: 54, en: 'Do not trust the profile photo or name alone. Contact the person through a number you already know.', ur: 'صرف پروفائل تصویر یا نام پر بھروسا نہ کریں۔ اس شخص سے ایسے نمبر کے ذریعے رابطہ کریں جو آپ پہلے سے جانتے ہوں۔' },
      { from: 54, to: 72, en: 'Never share verification codes, passwords, or banking details through a chat message.', ur: 'تصدیقی کوڈ، پاس ورڈ یا بینک معلومات کبھی بھی چیٹ پیغام کے ذریعے شیئر نہ کریں۔' },
      { from: 72, to: 90, en: 'If the request is suspicious, stop the conversation, block the account, and verify before taking any action.', ur: 'اگر درخواست مشکوک ہو تو گفتگو روک دیں، اکاؤنٹ بلاک کریں اور کوئی قدم اٹھانے سے پہلے تصدیق کریں۔' },
    ],
  },

  '65-70': {
    provider: 'instagram', id: 'DPvfGe4jXr1', start: 0, end: 25, title: 'رسالة توعوية للأمان الرقمي',
    captions: [
      { from: 0, to: 5, en: 'Awareness tip: A QR code can hide a link to a fake or harmful website.', ur: 'آگاہی مشورہ: کیو آر کوڈ کسی جعلی یا نقصان دہ ویب سائٹ کا لنک چھپا سکتا ہے۔' },
      { from: 5, to: 10, en: 'Before scanning, check that the QR code has not been covered or replaced with another sticker.', ur: 'اسکین کرنے سے پہلے دیکھیں کہ کیو آر کوڈ کے اوپر کوئی دوسرا اسٹیکر تو نہیں لگایا گیا۔' },
      { from: 10, to: 15, en: 'Read the website address shown on your phone before opening the page.', ur: 'صفحہ کھولنے سے پہلے فون پر دکھایا گیا ویب ایڈریس غور سے پڑھیں۔' },
      { from: 15, to: 20, en: 'Do not enter passwords, card details, or personal information after scanning an untrusted code.', ur: 'غیر معتبر کوڈ اسکین کرنے کے بعد پاس ورڈ، کارڈ کی تفصیلات یا ذاتی معلومات درج نہ کریں۔' },
      { from: 20, to: 25, en: 'If you are unsure, close the page and use the organization’s official website or contact details.', ur: 'اگر شک ہو تو صفحہ بند کریں اور ادارے کی سرکاری ویب سائٹ یا رابطہ معلومات استعمال کریں۔' },
    ],
  },

  '70+': {
    id: '-JJwewuGGEM', start: 0, end: 109, title: 'مكالمة احتيالية باسم البنك',
    captions: [
      { from: 0, to: 7, en: 'Fraud involving the gold card does not need a broken door; it only needs one phone call. The phone rang for Haj Mabrouk.', ur: 'گولڈ کارڈ کے ذریعے ہونے والے فراڈ کے لیے دروازہ توڑنے کی ضرورت نہیں ہوتی، صرف ایک فون کال کافی ہوتی ہے۔ حاج مبروک کا فون بجا۔' },
      { from: 7, to: 14, en: 'A calm and official voice on the other end said: “Peace be upon you, sir. We are calling from Algeria Post customer service.”', ur: 'دوسری طرف ایک پُرسکون اور سرکاری آواز آئی: “السلام علیکم جناب، ہم الجزائر پوسٹ کی کسٹمر سروس سے بات کر رہے ہیں۔”' },
      { from: 14, to: 22, en: '“We noticed a technical issue with your gold card, and we want to fix it before it affects your balance.”', ur: '“ہم نے آپ کے گولڈ کارڈ میں ایک تکنیکی خرابی دیکھی ہے، اور ہم اسے آپ کے بیلنس پر اثر انداز ہونے سے پہلے درست کرنا چاہتے ہیں۔”' },
      { from: 22, to: 28, en: 'One simple sentence was enough to build complete trust. Since you are elderly, and the company cares about the comfort of its customers…', ur: 'ایک سادہ سا جملہ مکمل اعتماد پیدا کرنے کے لیے کافی تھا۔ چونکہ آپ عمر رسیدہ ہیں، اور کمپنی اپنے صارفین کے آرام کا خیال رکھتی ہے…' },
      { from: 28, to: 36, en: '“Take your time and do not worry. Just bring the card in front of you.” Haj Mabrouk brought his gold card with complete confidence.', ur: '“آرام سے وقت لیں اور پریشان نہ ہوں۔ بس کارڈ اپنے سامنے رکھیں۔” حاج مبروک نے پورے اعتماد کے ساتھ اپنا گولڈ کارڈ سامنے رکھ لیا۔' },
      { from: 36, to: 43, en: '“Give me the number shown on the card, only to confirm the account.” Without hesitation, Haj Mabrouk read the numbers one by one.', ur: '“مجھے کارڈ پر لکھا ہوا نمبر بتائیں، صرف اکاؤنٹ کی تصدیق کے لیے۔” بغیر ہچکچاہٹ کے حاج مبروک نے ایک ایک کر کے نمبر پڑھنا شروع کر دیے۔' },
      { from: 43, to: 51, en: 'Information he thought was simple, because the caller sounded completely official. “Excellent, sir. You will now receive a text message…”', ur: 'یہ وہ معلومات تھیں جنہیں وہ معمولی سمجھ رہا تھا، کیونکہ کال کرنے والا مکمل طور پر سرکاری لگ رہا تھا۔ “بہت اچھا جناب، اب آپ کو ایک ٹیکسٹ میسج موصول ہوگا…”' },
      { from: 51, to: 59, en: '“…containing a four-digit code. Just read it to me for final confirmation.” Haj Mabrouk’s phone vibrated, and the message arrived.', ur: '“…جس میں چار ہندسوں کا ایک کوڈ ہوگا۔ بس حتمی تصدیق کے لیے وہ مجھے پڑھ کر سنا دیں۔” حاج مبروک کا فون بجا اور پیغام موصول ہو گیا۔' },
      { from: 59, to: 68, en: 'With full confidence, he began reading the code. At that exact moment, Haj Mabrouk was no longer speaking to a postal employee…', ur: 'اس نے پورے اعتماد کے ساتھ کوڈ پڑھنا شروع کر دیا۔ عین اسی لمحے، حاج مبروک اب کسی پوسٹ آفس کے ملازم سے بات نہیں کر رہے تھے…' },
      { from: 68, to: 75, en: '…he had handed the full key to his account to an unknown person. Algeria Post, like any official banking institution, never asks for your full card number or verification code…', ur: '…بلکہ وہ اپنے اکاؤنٹ کی مکمل کنجی ایک نامعلوم شخص کے حوالے کر چکے تھے۔ الجزائر پوسٹ، کسی بھی سرکاری بینکاری ادارے کی طرح، کبھی بھی آپ سے مکمل کارڈ نمبر یا تصدیقی کوڈ نہیں مانگتی…' },
      { from: 75, to: 83, en: '…over the phone. This code is meant for you alone, and it should never be requested for any confirmation or technical fix.', ur: '…فون پر۔ یہ کوڈ صرف آپ کے لیے ہوتا ہے، اور کسی بھی تصدیق یا خرابی دور کرنے کے لیے کبھی نہیں مانگا جاتا۔' },
      { from: 83, to: 92, en: 'If anyone calls claiming to be from the post office or the bank and asks for your full card number, a code sent by message, or your password…', ur: 'اگر کوئی شخص فون کر کے دعویٰ کرے کہ وہ پوسٹ آفس یا بینک سے ہے، اور آپ سے مکمل کارڈ نمبر، پیغام میں بھیجا گیا کوڈ، یا پاس ورڈ مانگے…' },
      { from: 92, to: 101, en: '…this is 100% fraud, no matter how official or sympathetic they may sound. End the call immediately and contact the official post office or bank number directly to verify.', ur: '…تو یہ 100 فیصد فراڈ ہے، چاہے وہ کتنا ہی سرکاری یا ہمدرد کیوں نہ لگے۔ فوراً کال بند کریں اور تصدیق کے لیے خود پوسٹ آفس یا بینک کے سرکاری نمبر پر رابطہ کریں۔' },
      { from: 101, to: 109, en: 'Share this video with your parents or any elderly person you know, because this call may be repeated with them tomorrow.', ur: 'یہ ویڈیو اپنے والدین یا کسی بھی بزرگ شخص کے ساتھ شیئر کریں جسے آپ جانتے ہوں، کیونکہ یہ کال کل ان کے ساتھ بھی دہرائی جا سکتی ہے۔' },
    ],
  },
};

type YTPlayer = {
  destroy: () => void;
  getCurrentTime: () => number;
  getPlayerState: () => number;
  pauseVideo: () => void;
  playVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
};
type YTApi = {
  Player: new (element: HTMLElement, options: {
    width?: string;
    height?: string;
    videoId: string;
    playerVars: Record<string, number>;
    events: { onReady: () => void; onStateChange: (event: { data: number }) => void; onError: () => void };
  }) => YTPlayer;
};

declare global {
  interface Window { YT?: YTApi; onYouTubeIframeAPIReady?: () => void }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (typeof window === 'undefined' || window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(); };
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://www.youtube.com/iframe_api"]');
    if (existing) { existing.addEventListener('error', () => reject(new Error('YouTube API failed'))); return; }
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => reject(new Error('YouTube API failed'));
    document.head.appendChild(script);
  });
  return apiPromise;
}

function formatSeconds(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
}

function splitCaption(cue: CaptionCue, from: number, to: number): CaptionCue[] {
  const split = (value: string) => {
    const words = value.split(' ');
    const middle = Math.ceil(words.length / 2);
    return [words.slice(0, middle).join(' '), words.slice(middle).join(' ')];
  };
  const [enFirst, enSecond] = split(cue.en);
  const [urFirst, urSecond] = split(cue.ur);
  const middle = (from + to) / 2;
  return [
    { from, to: middle, en: enFirst, ur: urFirst },
    { from: middle, to, en: enSecond, ur: urSecond },
  ];
}

export default function AwarenessVideo({ age, lang, complete, onComplete, onProgress, onError }: {
  age: AgeGroup;
  lang: Lang;
  complete: boolean;
  onComplete: () => void;
  onProgress: (progress: number) => void;
  onError: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const watchedUntil = useRef(0);
  const completedRef = useRef(complete);
  const lastPollAt = useRef(Date.now());
  const [current, setCurrent] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [instagramFinished, setInstagramFinished] = useState(false);
  const info = VIDEOS[age];
  const isInstagram = info.provider === 'instagram';
  const clipDuration = info.end - info.start;
  const displayCaptions = useMemo(
    () => info.captions,
    [info.captions],
  );

  useEffect(() => { completedRef.current = complete; }, [complete]);

  useEffect(() => {
    let alive = true;
    watchedUntil.current = info.start;
    lastPollAt.current = Date.now();
    setCurrent(0);
    setReady(isInstagram);
    setPlaying(false);
    setInstagramFinished(false);

    if (isInstagram) {
      watchedUntil.current = 0;
      return () => { alive = false; };
    }

    void loadYouTubeApi().then(() => {
      const YT = window.YT;
      if (!alive || !hostRef.current || !YT?.Player) return;
      playerRef.current = new YT.Player(hostRef.current, {
        width: '100%',
        height: '100%',
        videoId: info.id,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, enablejsapi: 1, playsinline: 1, rel: 0, start: info.start, end: info.end },
        events: {
          onReady: () => alive && setReady(true),
          onStateChange: ({ data }) => {
            if (alive) setPlaying(data === 1);
            if (data === 0 && !completedRef.current) {
              completedRef.current = true;
              onProgress(100);
              onComplete();
            }
          },
          onError: () => alive && onError(),
        },
      });
    }).catch(() => alive && onError());

    return () => { alive = false; playerRef.current?.destroy(); playerRef.current = null; };
  }, [info.end, info.id, info.start, isInstagram, onComplete, onError, onProgress]);

  useEffect(() => {
    if (!ready || isInstagram) return;
    const timer = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || player.getPlayerState() !== 1) { lastPollAt.current = Date.now(); return; }
      const now = Date.now();
      const elapsed = Math.max(0, (now - lastPollAt.current) / 1000);
      lastPollAt.current = now;
      const time = player.getCurrentTime();
      const allowedJump = Math.max(3.5, elapsed + 1.5);
      if (!completedRef.current && time > watchedUntil.current + allowedJump) { player.seekTo(watchedUntil.current, false); return; }
      watchedUntil.current = Math.max(watchedUntil.current, time);
      const relative = Math.max(0, Math.min(clipDuration, time - info.start));
      setCurrent(relative);
      onProgress(Math.min(99, Math.floor((relative / clipDuration) * 100)));
      if (!completedRef.current && time >= info.end - 1.5) {
        completedRef.current = true;
        player.pauseVideo();
        setPlaying(false);
        onProgress(100);
        onComplete();
      }
    }, 400);
    return () => window.clearInterval(timer);
  }, [clipDuration, info.end, info.start, isInstagram, onComplete, onProgress, ready]);

  useEffect(() => {
    if (!isInstagram || !playing || instagramFinished || completedRef.current) return;
    lastPollAt.current = Date.now();
    const timer = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.max(0, (now - lastPollAt.current) / 1000);
      lastPollAt.current = now;
      if (document.visibilityState !== 'visible') return;

      const next = Math.min(clipDuration, watchedUntil.current + elapsed);
      watchedUntil.current = next;
      setCurrent(next);
      onProgress(Math.min(99, Math.floor((next / clipDuration) * 100)));

      if (next >= clipDuration && !completedRef.current) {
        completedRef.current = true;
        setPlaying(false);
        setInstagramFinished(true);
        onProgress(100);
        onComplete();
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [clipDuration, instagramFinished, isInstagram, onComplete, onProgress, playing]);

  const caption = useMemo(
    () => displayCaptions.find((cue) => current >= cue.from && current < cue.to) ?? displayCaptions.at(-1),
    [current, displayCaptions],
  );

  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black" aria-label={info.title}>
        {isInstagram ? (
          instagramFinished ? (
            <div className="flex h-full items-center justify-center bg-slate-950 px-6 text-center font-black text-white">
              {lang === 'ar' ? '✓ تمت مشاهدة المقطع المطلوب' : lang === 'ur' ? '✓ مطلوبہ ویڈیو دیکھ لی گئی' : '✓ Required clip completed'}
            </div>
          ) : (
            <iframe
              src={`https://www.instagram.com/reel/${info.id}/embed/captioned/`}
              title={info.title}
              className="h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )
        ) : (
          <div ref={hostRef} className="h-full w-full" />
        )}
      </div>

      {isInstagram && !instagramFinished && (
        <p className="mt-2 text-center text-xs font-black text-amber-800">
          {lang === 'ar'
            ? 'شغّلي الفيديو من داخله، ثم اضغطي «بدأت المشاهدة» لتشغيل مؤقت الـ25 ثانية.'
            : lang === 'ur'
              ? 'ویڈیو کے اندر پلے دبائیں، پھر 25 سیکنڈ کا ٹائمر شروع کرنے کے لیے “دیکھنا شروع کیا” دبائیں۔'
              : 'Play the video inside the frame, then press “Started watching” to begin the 25-second timer.'}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            if (isInstagram) {
              setPlaying((value) => !value);
              return;
            }
            const player = playerRef.current;
            if (!player) return;
            if (playing) player.pauseVideo();
            else player.playVideo();
          }}
          className="rounded-xl bg-[var(--navy)] px-5 py-2 text-sm font-black text-white disabled:opacity-50"
        >
          {playing
            ? lang === 'ar' ? '⏸ إيقاف مؤقت' : lang === 'ur' ? '⏸ روکیں' : '⏸ Pause'
            : isInstagram
              ? lang === 'ar' ? '▶ بدأت المشاهدة' : lang === 'ur' ? '▶ دیکھنا شروع کیا' : '▶ Started watching'
              : lang === 'ar' ? '▶ تشغيل الفيديو' : lang === 'ur' ? '▶ ویڈیو چلائیں' : '▶ Play video'}
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => {
            if (isInstagram) {
              watchedUntil.current = 0;
              setCurrent(0);
              setPlaying(false);
              return;
            }
            playerRef.current?.seekTo(info.start, true);
            playerRef.current?.playVideo();
            setCurrent(0);
          }}
          className="rounded-xl border-2 border-slate-300 bg-white px-4 py-2 text-sm font-black text-slate-700 disabled:opacity-50"
        >
          {lang === 'ar' ? '↻ من البداية' : lang === 'ur' ? '↻ شروع سے' : '↻ Restart'}
        </button>
        <span className="tnum text-sm font-black text-[var(--fg-muted)]" dir="ltr">
          {formatSeconds(current)} / {formatSeconds(clipDuration)}
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-center shadow-inner" aria-live="polite">
        <p key={`en-${caption?.from}`} className="anim-in text-sm font-bold leading-6 text-white sm:text-base" dir="ltr" lang="en">
          <span className="mr-2 text-[10px] font-black uppercase tracking-wider text-sky-300">English</span>{caption?.en}
        </p>
        <div className="mx-auto my-3 h-px w-4/5 bg-white/15" />
        <p key={`ur-${caption?.from}`} className="anim-in text-sm font-bold leading-7 text-white sm:text-base" dir="rtl" lang="ur">
          <span className="ml-2 text-[10px] font-black text-emerald-300">اردو</span>{caption?.ur}
        </p>
      </div>
      <p className="ink-sm mt-2 text-center text-[11px] font-bold text-[var(--fg-muted)]">
        {lang === 'ar' ? 'الترجمة الإرشادية تتغير تلقائيًا مع تقدّم الفيديو.' : lang === 'ur' ? 'رہنمائی کا ترجمہ ویڈیو کے ساتھ خود بخود تبدیل ہوتا ہے۔' : 'The guidance translation changes automatically as the video plays.'}
      </p>
    </div>
  );
}
