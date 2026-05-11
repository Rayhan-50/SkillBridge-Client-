import { PageHeader } from "@/components/common/PageHeader";
import { ProfileSettingsForm } from "@/components/tutor/ProfileSettingsForm";

export default function TutorSettingsPage() {
    return (
        <div className="container mx-auto">
            <PageHeader title="Profile Settings" description="Update your tutor profile, bio, subjects, and hourly rate." />
            <div className="mt-8 p-8 border rounded-lg bg-card text-left">
                <ProfileSettingsForm />
            </div>
        </div>
    );
}
