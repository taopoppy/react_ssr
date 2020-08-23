import LRU from 'lru-cache'

const REPO_CACHE = new LRU({
	maxAge: 1000 * 60 * 60 // 100毫秒*60*60 = 1小时
})

export function cache(repo) {
	const full_name = repo.full_name
	REPO_CACHE.set(full_name, repo)
}

// full_name: facebook/react
export function get(full_name) {
	return REPO_CACHE.get(full_name)
}

// 对数组中的每项都进行缓存
export function cacheArray(repos) {
	repos.forEach(repo => {
		cache(repo)
	});
}
