import Header from './header';

export default function Layout(props) {
  return (
    <div>
      <Header user={props.user} refreshUserProfile={props.refreshUserProfile} />

      {
        // Page content
        props.children
      }
    </div>
  );
}
