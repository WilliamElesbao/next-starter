import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/navigation";

export function HomePage() {
  return (
    <div>
      <h1>Next Starter</h1>
      <Button asChild>
        <Link href="/subscription">Subscription</Link>
      </Button>
    </div>
  );
}
