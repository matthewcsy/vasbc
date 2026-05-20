import { SimplePage } from "@/components/simple-page";

export const dynamic = "force-dynamic";

export default function MissionsPage() {
  return (
    <SimplePage
      pageKey="missions"
      title="宣教工場"
      description="展示本地與海外宣教工場近況、代禱事項與參與方式。"
    />
  );
}
