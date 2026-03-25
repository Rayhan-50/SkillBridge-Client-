import { PageHeader } from "@/components/common/PageHeader";
import { ProfileSettingsForm } from "@/components/tutor/ProfileSettingsForm";

export default function TutorSettingsPage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Profile Settings"
                description="Update your tutor profile, bio, subjects, and hourly rate."
            />
            <div className="max-w-2xl">
                <ProfileSettingsForm />
            </div>
        </div>
    );
}
