//@ts-nocheck
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

interface InviteCodePageProps {
  params: {
    invitecode: string
  }
}
const InviteCodePage = async ({ params }: InviteCodePageProps) => {
  // Find current profile
  const profile = await currentProfile()
  if (!params.invitecode) {
    return redirect("/")
  }
  // Find if user is already member of that specific server
  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.invitecode,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  })
  // If Server exists then redirect to that server
  if (existingServer) {
    console.log("already member")
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await db.server.update({
    where: {
      inviteCode: params.invitecode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  })
  if (server) {
    console.log("new member created")
    return redirect(`/servers/${server.id}`)
  }
  return null
}

export default InviteCodePage
