import withRepoBasic from '../../components/with-repo-basic'

function Issues({text}){
	return <span>Detail index {text}</span>
}

Issues.getInitialProps = async () => {
	return {
		text:456
	}
}

export default withRepoBasic(Issues,'issues')