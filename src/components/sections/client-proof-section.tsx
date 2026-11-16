import { ClientProofShowcase } from "@/components/sections/client-proof-frame";
import { type ClientProofData } from "@/content/types";

export type { ClientProofData };

/** Rozavio brand orange, used only for a faint corner glow. */
const ROZAVIO_ORANGE = "#EA4E1A";

/**
 * Client Proof section ("Our Work"), placed directly below the Hero.
 *
 * The Hero already previews client sites as a scrollable stack, so this
 * section shows the same work as a verifiable showcase: the selected
 * site in a browser frame with the others stacked behind it, beside a
 * short claim, the client's identity and the one conversion action. The
 * interactive part lives in `ClientProofShowcase`.
 */
export function ClientProofSection({ data }: { data: ClientProofData }) {
  return (
    <section
      id="our-work"
      className="client_proof_section relative scroll-mt-20 overflow-x-clip text-[#14110d]"
      style={{
        backgroundColor: "rgb(248, 245, 238)",
        backgroundImage:
          "radial-gradient(ellipse 55% 50% at 92% 0%, color-mix(in srgb, " +
          ROZAVIO_ORANGE +
          " 8%, transparent), transparent 70%)",
      }}
    >
      <ClientProofShowcase data={data} />
    </section>
  );
}
