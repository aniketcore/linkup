import { ensureDatabaseReady } from "../../../../lib/permit-workflow";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const database = await ensureDatabaseReady();
    const applicationId = params.id;
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;

    const documentType = String(payload.document_type ?? payload.type ?? "").trim();
    const fileName = String(payload.file_name ?? payload.fileName ?? "").trim();
    const fileUrl = String(payload.file_url ?? payload.fileUrl ?? "").trim();
    const storageKey = String(payload.storage_key ?? payload.storageKey ?? "").trim();
    const uploadedBy = String(payload.uploaded_by ?? payload.uploadedBy ?? "applicant").trim();

    if (!documentType || !fileName) {
      return Response.json(
        { ok: false, error: "document_type and file_name are required." },
        { status: 400 }
      );
    }

    const application = await database
      .prepare(`SELECT id FROM applications WHERE id = ?`)
      .bind(applicationId)
      .first<{ id: string }>();

    if (!application) {
      return Response.json(
        { ok: false, error: "Application not found." },
        { status: 404 }
      );
    }

    const documentId = crypto.randomUUID();
    const now = new Date().toISOString();

    await database
      .prepare(
        `
          INSERT INTO documents (
            id, application_id, document_type, file_name, storage_key, file_url,
            uploaded_by, status, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, 'uploaded', ?, ?)
        `
      )
      .bind(
        documentId,
        applicationId,
        documentType,
        fileName,
        storageKey || null,
        fileUrl || null,
        uploadedBy || null,
        now,
        now
      )
      .run();

    await database
      .prepare(
        `UPDATE applications SET last_updated_date = ?, updated_at = ? WHERE id = ?`
      )
      .bind(now, now, applicationId)
      .run();

    return Response.json({
      ok: true,
      document: {
        id: documentId,
        application_id: applicationId,
        document_type: documentType,
        file_name: fileName,
        file_url: fileUrl || null,
        storage_key: storageKey || null,
      },
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
