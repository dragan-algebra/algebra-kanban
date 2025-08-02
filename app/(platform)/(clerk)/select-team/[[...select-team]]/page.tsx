import { OrganizationList } from "@clerk/nextjs";

export default function CreateTeamPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/team/:id"
      afterCreateOrganizationUrl="/team/:id"
    />
  );
}
