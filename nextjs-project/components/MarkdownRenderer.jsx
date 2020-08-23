import { memo, useMemo} from 'react' // 7 因为MarkdowRenderer只依赖props，所以使用memo优化
import MarkdownIt from 'markdown-it' // 1. 引入MarkdownIt
import 'github-markdown-css'  // 2. 引入github-markdown-css样式，markdown-body包含在其中

const md = new MarkdownIt({
	html:true, // 3. markdown当中html语法直接生成html代码
	linkify: true // 4. markdown中的网站链接是一个真的链接，而不是一个字符串
})


// 5. 因为atob直接转换中文会出问题，需要将base64转换成为utf8
function b64_to_utf8(str) {
	return decodeURIComponent(escape(atob(str)))
}

export default memo(function MarkdowRenderer({ content, isBase64}) {
	// 6. 是base64的字符串就进行转换
	const markdown = isBase64 ? b64_to_utf8(content): content
	// 8. markdown不发生变化，html就不变化
	const html = useMemo(() => md.render(markdown), [markdown])

	return <div className="markdown-body">
		<div dangerouslySetInnerHTML={{__html:html}} />
</div>
})