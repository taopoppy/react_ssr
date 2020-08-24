import moment from 'moment'

// 1.时间处理的函数，将时间展现为多久之前
export function getLastUpdated(time) {
	return moment(time).fromNow()
}