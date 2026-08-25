import { prisma } from "@/lib/prisma";
import { requireMember } from "@/lib/require-member";
import { addDocument, deleteDocument } from "@/lib/actions/documents";
import { DOCUMENT_TYPES } from "@/lib/constants";
import { Badge, Button, Card, EmptyState, Input, Label, PageHeader, Select, Textarea } from "@/components/ui";
import { DeleteButton } from "@/components/delete-button";

const TYPE_LABEL = Object.fromEntries(DOCUMENT_TYPES.map((t) => [t.value, t.label]));

export default async function DocumentsPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  await requireMember(tripId);

  const documents = await prisma.tripDocument.findMany({ where: { tripId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Billets, réservations, passeport, assurance..." />

      <Card className="p-5">
        <form action={addDocument.bind(null, tripId)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input id="title" name="title" placeholder="Vol Paris → Rome" required />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select id="type" name="type" defaultValue="autre">
                {DOCUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="link">Lien (optionnel)</Label>
            <Input id="link" name="link" type="url" placeholder="https://..." />
          </div>
          <div>
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" placeholder="Numéro de réservation, référence..." rows={2} />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Ajouter le document
          </Button>
        </form>
      </Card>

      {documents.length === 0 ? (
        <EmptyState title="Aucun document" description="Ajoute tes billets, réservations et autres documents importants." />
      ) : (
        <Card className="divide-y divide-border">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{doc.title}</p>
                  <Badge tone="primary">{TYPE_LABEL[doc.type] ?? doc.type}</Badge>
                </div>
                {doc.note && <p className="text-sm text-muted-foreground mt-1">{doc.note}</p>}
                {doc.link && (
                  <a
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 inline-block break-all"
                  >
                    {doc.link}
                  </a>
                )}
              </div>
              <DeleteButton action={deleteDocument.bind(null, tripId, doc.id)} label="Supprimer le document" />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
