import { escape, button } from "./ui.mjs";

export async function render(ctx) {
  const response = await fetch(
    new URL("../assets/highlight-vocabulary-prompt.txt", import.meta.url),
    { signal: ctx.signal },
  );
  if (!response.ok) throw Error("教程指令暂时无法加载，请刷新后重试");
  const prompt = await response.text();
  if (!ctx.alive()) return;

  ctx.mount(`<div class="page-title"><h1>使用教程页面</h1></div>
    <section class="panel tutorial-intro" aria-labelledby="tutorial-about">
      <h2 id="tutorial-about">打造你自己的个性化词库</h2>
      <p>这是专用于打造个性化词库的英语背词工具。不同于传统的背词类 App（如百词斩），此工具能够整理用户导入的个性化生词、错词，并生成记忆卡片，供用户学习。</p>
      <p>通俗点讲，此工具省去了背所有词的麻烦，只需过掉自己不会的和生疏的，节省时间，提高效率。</p>
    </section>
    <section class="panel" aria-labelledby="tutorial-steps">
      <h2 id="tutorial-steps">使用步骤</h2>
      <ol class="tutorial-steps">
        <li><h3>标记生词，拍摄材料</h3><p>完成每一套真题试卷后，用荧光笔高亮出你不会、不懂的生词，再用相机拍下来。最好增强图片显示效果，例如使用扫描全能王；若有条件，可以将图片整理成 PDF。</p></li>
        <li><h3>让视觉模型生成 TXT</h3><p>使用 <a href="https://chat.z.ai/" target="_blank" rel="noopener noreferrer">GLM 5.3-flash ↗</a>、DeepSeek v4.1flash、GPT 等具有视觉理解能力的模型。上传图片，复制下方完整指令，让模型生成词库 TXT 文件。</p></li>
        <li><h3>创建词库并导入</h3><p>保存好 TXT 文件，在本网站<a href="#library">“我的词库”</a>中点击“创建词库”并填写名称。随后点击“导入 TXT”，选择目标词库、上传文件，检查导入预览，最后点击“确认保存有效词条”，即可开始学习。</p></li>
      </ol>
    </section>
    <aside class="panel tutorial-warning" aria-labelledby="tutorial-backup">
      <h2 id="tutorial-backup">注意：不要清除网站的浏览器数据</h2>
      <p>词库与学习进度保存在当前浏览器中。清除本网站的浏览器数据会删除本地记录，请定期在<a href="#settings">“计划与数据”</a>中导出完整 JSON 备份。</p>
      <p>更换设备或浏览器时，需手动导入备份，数据不会自动同步。</p>
      <div class="actions"><a href="#settings">前往备份与恢复 →</a></div>
    </aside>
    <section class="panel tutorial-prompt" aria-labelledby="tutorial-prompt-title">
      <h2 id="tutorial-prompt-title">生成词库的完整指令</h2>
      <p>复制以下指令，粘贴到视觉模型对话中，再上传高亮图片。指令要求模型交付可导入的 UTF-8 JSONL 格式 TXT 文件。</p>
      <div class="actions">${button("复制完整指令", "copy-tutorial-prompt", 'class="primary"')}<span class="muted small">包含图片识别、来源标记、文件格式、自检与交付要求。</span></div>
      <textarea id="tutorial-prompt" readonly spellcheck="false" rows="24" aria-label="高亮英语词库生成指令">${escape(prompt)}</textarea>
    </section>`);

  ctx.on("click", '[data-action="copy-tutorial-prompt"]', async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      if (ctx.alive()) ctx.notice("完整指令已复制，可粘贴到模型对话中");
    } catch {
      if (!ctx.alive()) return;
      const textarea = document.getElementById("tutorial-prompt");
      textarea.focus({ preventScroll: true });
      textarea.select();
      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch {
        // Keep the complete prompt selected when automatic copying is blocked.
      }
      ctx.notice(
        copied
          ? "完整指令已复制，可粘贴到模型对话中"
          : "自动复制不可用，已选中完整指令，请按 Ctrl+C 复制",
        !copied,
      );
    }
  });
}
