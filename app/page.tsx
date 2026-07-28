import HomeContent from "./home-content"

// Static again now the hero no longer shows a live "from" price. Nothing on
// this page reads the database, so there is nothing to keep fresh per request.
export default function Page() {
  return <HomeContent />
}
