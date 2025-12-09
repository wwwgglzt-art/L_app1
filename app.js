// --- 多语言配置（中、英、日完整支持，已更新hero.subtitle）---
const languagePack = {
    en: {
        nav: {
            home: "Home",
            write: "Write",
            read: "Read",
            lang: "Language"
        },
        lang: {
            selectTitle: "Select Language"
        },
        hero: {
            title: "Global Game Share Forum.",
            subtitle: "Welcome, this is a message board about games, looking forward to your messages",
            writeBtn: "Share a Game",
            readBtn: "View Shared Games"
        },
        write: {
            title: "Share Your Favorite Game",
            subtitle: "Share your favorite game with gamers around the world.",
            nameLabel: "Name",
            namePlaceholder: "Your Name (Optional)",
            messageLabel: "Game & Thoughts",
            messagePlaceholder: "My favorite game is... It's awesome because...",
            postBtn: "Share Now",
            charCount: "{count}/250",
            postingText: "Sharing..."
        },
        read: {
            loading: "Connecting to global game stream...",
            noMessages: "No shared games yet. Be the first to share!",
            loadFailed: "Failed to load shared games. Please try again later."
        },
        errors: {
            emptyMessage: "Game sharing content cannot be empty. Please enter details first",
            postFailed: "Sharing failed. Please check your network and try again",
            networkError: "Network error. Please check your connection and try again.",
            unknown: "Something went wrong. Please try again."
        },
        footer: {
            copyright: "Designed for Gamers. Interactive Global System."
        }
    },
    zh: {
        nav: {
            home: "首页",
            write: "分享",
            read: "浏览",
            lang: "语言"
        },
        lang: {
            selectTitle: "选择语言"
        },
        hero: {
            title: "全球游戏分享论坛",
            subtitle: "欢迎，这是一个关于游戏的留言板，期待您的留言",
            writeBtn: "分享游戏",
            readBtn: "浏览分享"
        },
        write: {
            title: "分享你喜欢的游戏",
            subtitle: "与全球玩家分享你喜爱的游戏。",
            nameLabel: "昵称",
            namePlaceholder: "你的名字（可选）",
            messageLabel: "游戏及感想",
            messagePlaceholder: "我最喜欢的游戏是... 它超棒的原因是...",
            postBtn: "立即分享",
            charCount: "{count}/250",
            postingText: "分享中..."
        },
        read: {
            loading: "连接全球游戏分享流中...",
            noMessages: "暂无游戏分享，快来成为第一个分享的人吧！",
            loadFailed: "加载游戏分享失败，请稍后再试。"
        },
        errors: {
            emptyMessage: "游戏分享内容不能为空，请输入详情后再发布～",
            postFailed: "分享失败，请检查网络后重试",
            networkError: "网络错误，请检查网络连接后重试。",
            unknown: "发生未知错误，请重试。"
        },
        footer: {
            copyright: "为玩家设计 · 交互式全球系统"
        }
    },
    ja: {
        nav: {
            home: "ホーム",
            write: "共有",
            read: "閲覧",
            lang: "言語"
        },
        lang: {
            selectTitle: "言語を選択"
        },
        hero: {
            title: "グローバルゲーム共有フォーラム",
            subtitle: "ようこそ！ここはゲームに関する掲示板です。皆様のコメントをお待ちしております",
            writeBtn: "ゲームを共有",
            readBtn: "共有を閲覧"
        },
        write: {
            title: "お気に入りのゲームを共有",
            subtitle: "世界中のゲーマーとお気に入りのゲームを共有しよう。",
            nameLabel: "名前",
            namePlaceholder: "名前（任意）",
            messageLabel: "ゲームと感想",
            messagePlaceholder: "私のお気に入りのゲームは... 理由は超すごいから...",
            postBtn: "今すぐ共有",
            charCount: "{count}/250",
            postingText: "共有中..."
        },
        read: {
            loading: "グローバルゲーム共有ストリームに接続中...",
            noMessages: "まだ共有されたゲームがありません。最初に共有しよう！",
            loadFailed: "ゲーム共有の読み込みに失敗しました。後で再試行してください。"
        },
        errors: {
            emptyMessage: "ゲーム共有内容は空にできません。詳細を入力してから発行してください～",
            postFailed: "共有に失敗しました。ネットワークを確認して再試行してください",
            networkError: "ネットワークエラーです。接続を確認して再試行してください。",
            unknown: "予期しないエラーが発生しました。再試行してください。"
        },
        footer: {
            copyright: "ゲーマーのために設計・インタラクティブグローバルシステム"
        }
    }
};

// --- 核心配置：后端地址（与 server.js 端口一致）---
const API_BASE_URL = 'https://l-app1-1.onrender.com'; 

// 全局状态变量
let posterId = localStorage.getItem('anonymous_poster_id');
let isPosting = false;
let currentLang = localStorage.getItem('selected_lang') || 'zh'; // 默认中文

// DOM 元素获取（确保所有元素正确获取）
const views = {
    lang: document.getElementById('view-lang'),
    landing: document.getElementById('view-landing'),
    write: document.getElementById('view-write'),
    read: document.getElementById('view-read')
};
const navButtons = {
    landing: document.getElementById('nav-landing'),
    write: document.getElementById('nav-write'),
    read: document.getElementById('nav-read'),
    lang: document.getElementById('nav-lang')
};
const form = document.getElementById('post-form');
const inputName = document.getElementById('input-name');
const inputMessage = document.getElementById('input-message');
const charCount = document.getElementById('char-count'); // 关键：字符计数元素
const submitBtn = document.getElementById('submit-btn');
const messagesGrid = document.getElementById('messages-grid');
const loadingIndicator = document.getElementById('loading-indicator');
const errorContainer = document.getElementById('error-container');
const navLogo = document.getElementById('nav-logo');
const heroWriteBtn = document.getElementById('hero-write-btn');
const heroReadBtn = document.getElementById('hero-read-btn');
const langEnBtn = document.getElementById('lang-en');
const langZhBtn = document.getElementById('lang-zh');
const langJaBtn = document.getElementById('lang-ja');

// --- 多语言工具函数 ---
function t(key) {
    const keyParts = key.split('.');
    return keyParts.reduce((obj, part) => {
        return obj && obj[part] ? obj[part] : key;
    }, languagePack[currentLang]);
}

// 更新所有界面文本（修复：确保所有标签/占位符都更新）
function updateUIWithLang() {
    console.log('当前语言：', currentLang); // 调试日志
    // 导航栏
    navButtons.landing.textContent = t('nav.home');
    navButtons.write.textContent = t('nav.write');
    navButtons.read.textContent = t('nav.read');
    navButtons.lang.textContent = t('nav.lang');
    
    // 语言选择页标题
    const langTitle = document.querySelector('#view-lang h2');
    if (langTitle) langTitle.textContent = t('lang.selectTitle');
    
    // 首页英雄区
    const heroTitle = document.querySelector('#view-landing h1');
    const heroSubtitle = document.querySelector('#view-landing p');
    if (heroTitle) heroTitle.innerHTML = t('hero.title');
    if (heroSubtitle) heroSubtitle.innerHTML = t('hero.subtitle');
    if (heroWriteBtn) heroWriteBtn.textContent = t('hero.writeBtn');
    if (heroReadBtn) heroReadBtn.textContent = t('hero.readBtn');
    
    // 发布页（关键修复：确保所有文本都更新为当前语言）
    const writeTitle = document.querySelector('#view-write h2');
    const writeSubtitle = document.querySelector('#view-write p');
    const nameLabel = document.querySelector('#view-write label[for="input-name"]');
    const messageLabel = document.querySelector('#view-write label[for="input-message"]');
    
    if (writeTitle) writeTitle.textContent = t('write.title');
    if (writeSubtitle) writeSubtitle.textContent = t('write.subtitle');
    if (nameLabel) nameLabel.textContent = t('write.nameLabel'); // 修复“NAME”不转中文
    if (inputName) inputName.placeholder = t('write.namePlaceholder'); // 修复占位符不转中文
    if (messageLabel) messageLabel.textContent = t('write.messageLabel');
    if (inputMessage) inputMessage.placeholder = t('write.messagePlaceholder');
    if (submitBtn) submitBtn.textContent = t('write.postBtn');
    
    // 查看页
    if (loadingIndicator) loadingIndicator.textContent = t('read.loading');
    
    // 页脚
    const footerText = document.querySelector('footer p');
    if (footerText) footerText.textContent = t('footer.copyright');
    
    // 字符计数
    const len = inputMessage ? inputMessage.value.length : 0;
    if (charCount) charCount.textContent = t('write.charCount').replace('{count}', len);
}

// 语言选择事件绑定（确保切换后立即更新UI）
function bindLangSelect() {
    // 英文
    if (langEnBtn) {
        langEnBtn.addEventListener('click', () => {
            currentLang = 'en';
            localStorage.setItem('selected_lang', currentLang);
            updateUIWithLang();
            switchView('landing');
        });
    }

    // 中文
    if (langZhBtn) {
        langZhBtn.addEventListener('click', () => {
            currentLang = 'zh';
            localStorage.setItem('selected_lang', currentLang);
            updateUIWithLang();
            switchView('landing');
        });
    }

    // 日语
    if (langJaBtn) {
        langJaBtn.addEventListener('click', () => {
            currentLang = 'ja';
            localStorage.setItem('selected_lang', currentLang);
            updateUIWithLang();
            switchView('landing');
        });
    }
}

// 匿名用户ID生成
function initAnonymousUser() {
    if (!posterId) {
        posterId = generateUUID();
        localStorage.setItem('anonymous_poster_id', posterId);
        console.log('生成匿名用户ID：', posterId); // 调试日志
    }
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 事件监听绑定（修复发布按钮启用逻辑）
function attachEventListeners() {
    // 导航按钮切换
    if (navButtons.landing) navButtons.landing.addEventListener('click', () => switchView('landing'));
    if (navButtons.write) navButtons.write.addEventListener('click', () => switchView('write'));
    if (navButtons.read) navButtons.read.addEventListener('click', () => {
        switchView('read');
        fetchMessages();
    });
    if (navButtons.lang) navButtons.lang.addEventListener('click', () => switchView('lang'));

    // Logo 跳转首页
    if (navLogo) navLogo.addEventListener('click', () => switchView('landing'));

    // 首页按钮跳转
    if (heroWriteBtn) heroWriteBtn.addEventListener('click', () => switchView('write'));
    if (heroReadBtn) heroReadBtn.addEventListener('click', () => {
        switchView('read');
        fetchMessages();
    });

    // 输入框实时计数 + 按钮启用逻辑（核心修复）
    if (inputMessage) {
        inputMessage.addEventListener('input', () => {
            showError(null);
            const messageLength = inputMessage.value.trim().length; // trim() 排除纯空格
            console.log('输入长度：', messageLength); // 调试日志
            if (charCount) charCount.textContent = t('write.charCount').replace('{count}', messageLength);

            // 按钮状态切换（强制更新，避免样式残留）
            if (messageLength > 0 && !isPosting && submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('bg-zinc-900', 'text-zinc-600', 'cursor-not-allowed');
                submitBtn.classList.add('bg-white', 'text-black', 'hover:bg-zinc-200');
            } else if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add('bg-zinc-900', 'text-zinc-600', 'cursor-not-allowed');
                submitBtn.classList.remove('bg-white', 'text-black', 'hover:bg-zinc-200');
            }
        });
    }

    // 表单提交（确保参数正确传递）
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const message = inputMessage ? inputMessage.value.trim() : '';
            // 匿名用户名（跟随当前语言）
            const username = inputName ? (inputName.value.trim() || (
                currentLang === 'zh' ? '匿名玩家' : 
                currentLang === 'en' ? 'Anonymous Gamer' : 
                '匿名プレイヤー'
            )) : '匿名用户';

            console.log('提交数据：', { username, message, poster_id: posterId }); // 调试日志

            if (!message || !posterId) {
                showError(t('errors.emptyMessage'));
                return;
            }

            isPosting = true;
            if (submitBtn) {
                submitBtn.textContent = t('write.postingText');
                submitBtn.disabled = true;
            }
            showError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/api/message`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, message, poster_id: posterId })
                });

                const responseData = await response.json();
                console.log('后端响应：', responseData); // 调试日志
                if (!response.ok || responseData.error) {
                    throw new Error(responseData.error || t('errors.postFailed'));
                }

                // 重置表单
                if (inputMessage) inputMessage.value = '';
                if (inputName) inputName.value = '';
                if (charCount) charCount.textContent = t('write.charCount').replace('{count}', 0);
                switchView('read');
                fetchMessages();
            } catch (error) {
                console.error('发布失败：', error.message); // 调试日志
                // 网络错误翻译（跟随语言）
                let errorMsg = error.message;
                if (errorMsg.includes('Failed to fetch')) {
                    errorMsg = t('errors.networkError');
                }
                showError(errorMsg || t('errors.unknown'));
            } finally {
                isPosting = false;
                if (submitBtn) {
                    submitBtn.textContent = t('write.postBtn');
                    submitBtn.disabled = true;
                    submitBtn.classList.add('bg-zinc-900', 'text-zinc-600', 'cursor-not-allowed');
                    submitBtn.classList.remove('bg-white', 'text-black', 'hover:bg-zinc-200');
                }
            }
        });
    }
}

// 获取游戏分享（确保后端接口调用正确）
async function fetchMessages() {
    if (loadingIndicator) loadingIndicator.classList.remove('hidden');
    if (messagesGrid) messagesGrid.innerHTML = '';

    try {
        console.log('请求后端接口：', `${API_BASE_URL}/api/messages`); // 调试日志
        const response = await fetch(`${API_BASE_URL}/api/messages`);
        const messages = await response.json();
        console.log('获取到的分享：', messages); // 调试日志

        if (response.ok && messages.error) {
            throw new Error(messages.error);
        }

        if (messages.length === 0 && messagesGrid) {
            messagesGrid.innerHTML = `<div class="col-span-full text-center text-zinc-600">${t('read.noMessages')}</div>`;
        } else if (messagesGrid) {
            messages.forEach(msg => renderMessageCard(msg));
        }
    } catch (error) {
        console.error('获取分享失败：', error.message); // 调试日志
        let errorMsg = error.message;
        if (errorMsg.includes('Failed to fetch')) {
            errorMsg = t('errors.networkError');
        }
        showError(errorMsg || t('errors.unknown'));
        if (messagesGrid) {
            messagesGrid.innerHTML = `<div class="col-span-full text-center text-zinc-600">${t('read.loadFailed')}</div>`;
        }
    } finally {
        if (loadingIndicator) loadingIndicator.classList.add('hidden');
    }
}

// 渲染分享卡片（确保日期和内容正确显示）
function renderMessageCard(msg) {
    const card = document.createElement('div');
    // 日期格式（跟随当前语言）
    const formattedDate = new Date(msg.created_at).toLocaleDateString(
        currentLang === 'zh' ? 'zh-CN' : 
        currentLang === 'en' ? 'en-US' : 
        'ja-JP', 
        { month: 'short', day: 'numeric' }
    );

    card.className = "glass-card p-6 rounded-3xl hover:border-zinc-500 transition-colors duration-300 flex flex-col justify-between min-h-[200px] fade-in";
    card.innerHTML = `
        <p class="text-lg text-zinc-200 font-light leading-relaxed mb-6">"${escapeHtml(msg.message)}"</p>
        <div class="flex justify-between items-end border-t border-zinc-800/50 pt-4">
            <span class="font-medium text-zinc-400">${escapeHtml(msg.username)}</span>
            <span class="text-xs text-zinc-600 uppercase tracking-wide">${formattedDate}</span>
        </div>
    `;

    if (messagesGrid) messagesGrid.appendChild(card);
}

// 视图切换（确保样式和显示正确）
function switchView(viewName) {
    showError(null);

    // 导航按钮样式更新
    Object.keys(navButtons).forEach(key => {
        const btn = navButtons[key];
        if (btn) {
            if (key === viewName) {
                btn.classList.add('bg-white', 'text-black', 'font-medium');
                btn.classList.remove('text-white');
            } else {
                btn.classList.remove('bg-white', 'text-black', 'font-medium');
                btn.classList.add('text-white');
            }
        }
    });

    // 视图显示切换
    Object.keys(views).forEach(key => {
        const section = views[key];
        if (section) {
            if (key === viewName) {
                section.classList.remove('hidden');
                section.classList.remove('fade-in-up');
                void section.offsetWidth; // 触发重绘
                section.classList.add('fade-in-up');
            } else {
                section.classList.add('hidden');
            }
        }
    });
}

// 错误提示（确保显示正确）
function showError(message) {
    if (message && errorContainer) {
        errorContainer.textContent = message;
        errorContainer.classList.remove('hidden');
    } else if (errorContainer) {
        errorContainer.classList.add('hidden');
        errorContainer.textContent = '';
    }
}

// HTML 转义（防XSS）
function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// 初始化应用（确保所有函数都被调用）
function initApp() {
    console.log('初始化应用...'); // 调试日志
    initAnonymousUser();
    bindLangSelect();
    attachEventListeners();

    // 首次打开显示语言选择页，否则直接显示当前语言的首页
    if (!localStorage.getItem('selected_lang')) {
        switchView('lang');
    } else {
        updateUIWithLang();
        switchView('landing');
    }
}

// 启动应用

initApp();
