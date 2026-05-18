import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      "common": {
        "version": "Version 1.1.0",
        "page_sections": "Page sections",
        "language": "Language",
        "cancel": "CANCEL",
        "save": "SAVE",
        "edit": "EDIT",
        "delete": "DELETE",
        "remove": "REMOVE",
        "confirm": "CONFIRM",
        "back": "BACK",
        "continue": "CONTINUE",
        "acknowledge_continue": "ACKNOWLEDGE & CONTINUE",
        "export_session": "EXPORT SESSION (JSON)",
        "close_session": "CLOSE SESSION"
      },
      "landing": {
        "title": "LIVE BUG HUNT",
        "subtitle": "A free gamified testing tool for live exploratory test sessions.\nCreate a session, project it on-screen, and motivate teams to find bugs together.",
        "start_new": "START NEW SESSION",
        "start_new_desc": "Set up a fresh bug hunt from scratch.",
        "import_existing": "IMPORT EXISTING SESSION",
        "import_existing_desc": "Resume a previously exported session (.json).",
        "privacy_title": "100% Client-Side & Privacy-First",
        "privacy_desc": "All data stays in your browser's memory. We don't have a database, and we don't track your bugs.",
        "privacy_desc_2": "To continue later, export your session as a JSON file and import it again when you return.",
        "privacy_desc_3": "Keep your JSON file safe - it is the only way to restore your session.",
        "disclaimer_title": "Usage Disclaimer",
        "disclaimer_body_1": "This application is provided free of charge on an \"as is\" and \"as available\" basis, without warranties of any kind.",
        "disclaimer_body_2": "To the maximum extent permitted by law, the owner is not responsible for any direct, indirect, incidental, consequential, special, business, data-loss, or other damages arising from the use of, inability to use, malfunction, interruption, error, crash, depreciation, or unavailability of this application.",
        "disclaimer_body_3": "No bug hunt session data is automatically stored by this service. If session data is lost, unsaved, overwritten, corrupted, or unavailable, it cannot be recovered by the owner or the application.",
        "disclaimer_body_4": "You are responsible for using the Bug Hunt application appropriately, for complying with applicable laws and organizational policies, and for exporting any session data as JSON if you want to save or continue it later.",
        "disclaimer_body_5": "By continuing, you acknowledge that you use this application at your own risk and that you are responsible for the correct use of the application and for saving any data you want to keep.",
        "disclaimer_agree": "I acknowledge that I use this application at my own risk and that I am responsible for saving any data I want to keep.",
        "start_card": {
          "title": "START NEW BUG HUNT",
          "desc": "Create a new play area from scratch.",
          "feature_1": "Set up teams or participants",
          "feature_2": "Track bugs in real time",
          "feature_3": "Export your session as JSON",
          "button": "START NEW SESSION"
        },
        "import_card": {
          "title": "LOAD EXISTING BUG HUNT",
          "desc": "Import a previously exported JSON file.",
          "feature_1": "Continue where you left off",
          "feature_2": "All data will be restored",
          "feature_3": "No data is stored automatically",
          "validating": "Validating {{fileName}}...",
          "error_title": "Could not load session",
          "success_text": "validated successfully.",
          "choose_another": "Choose another file",
          "button": "LOAD SESSION",
          "dropzone": {
            "idle": "Drag & drop a .json session file here, or click to browse",
            "active": "Drop the file here...",
            "click": "Click to select a JSON file",
            "or_drag": "or drag and drop here"
          }
        }
      },
      "setup": {
        "title": "SESSION SETUP",
        "subtitle_individual": "Configure your bug hunt before starting. Add participants and select the mode.",
        "subtitle_team": "Configure your bug hunt before starting. Add participants, create teams and adjust settings.",
        "reset_session": "RESET SESSION",
        "save_go": "SAVE & GO TO PLAY AREA",
        "error_no_participants": "Add at least one participant to continue.",
        "error_no_teams": "Create at least one team to continue.",
        "confirm_reset": "ARE YOU SURE? THIS WILL CLEAR EVERYTHING.",
        "add_participants": {
          "title": "1. ADD PARTICIPANTS",
          "helper": "Enter one name per line or separated by commas.",
          "placeholder": "Elias, Linus, ...\nNelio",
          "tip": "You can paste names from spreadsheets or lists.",
          "add_btn": "ADD PARTICIPANT",
          "add_demo": "ADD DEMO DATA",
          "clear_all": "CLEAR ALL",
          "confirm_clear": "Are you sure?",
          "yes_clear": "Yes, clear",
          "cancel": "Cancel"
        },
        "tabs": {
          "mode": "1. MODE",
          "participants": "2. PARTICIPANTS",
          "teams": "3. TEAMS",
          "review": "4. REVIEW"
        },
        "mode": {
          "title": "CHOOSE YOUR HUNTING MODE",
          "label": "Mode",
          "individual": "Individual (Deathmatch)",
          "team": "Team-based",
          "individual_hint": "Everyone competes individually.",
          "team_hint": "Participants are grouped into teams.",
          "individual_card": "INDIVIDUAL MODE",
          "individual_desc": "Every participant competes for themselves.",
          "team_card": "TEAM MODE",
          "team_desc": "Participants are grouped into teams. Scores are aggregated."
        },
        "participants": {
          "title": "ADD PARTICIPANTS",
          "desc": "Enter names of people joining the hunt.",
          "placeholder": "Enter names (one per line or comma-separated)...",
          "add_button": "ADD PARTICIPANTS",
          "add_demo": "ADD DEMO DATA",
          "clear_all": "CLEAR ALL",
          "manage_title": "MANAGE PARTICIPANTS",
          "manage_desc": "Review, edit, or remove participants.",
          "empty": "No participants added yet.",
          "table_num": "#",
          "table_name": "PARTICIPANT",
          "table_actions": "ACTIONS"
        },
        "teams": {
          "title": "TEAM ASSIGNMENT",
          "auto_title": "2. ASSIGN TEAMS (Auto)",
          "auto_desc": "Automatically distribute participants into teams.",
          "num_teams": "Number of Teams",
          "shuffle": "AUTO-SHUFFLE TEAMS",
          "manage_title": "4. MANAGE TEAMS",
          "manage_desc": "Review and edit teams. You can change team names and move participants between teams.",
          "add_member": "Add Member",
          "no_teams": "Use \"AUTO-SHUFFLE TEAMS\" to create teams.",
          "members": "Members",
          "add_member_aria": "Add member to team",
          "remove_member_aria": "Remove member from team",
          "delete_team_aria": "Delete team",
          "edit_team_name_aria": "Edit team name",
          "auto_note": "Participants will be distributed as evenly as possible.",
          "drag_hint": "Drag and drop participants to move them between teams.",
          "stepper_dec_aria": "Decrease team count",
          "stepper_inc_aria": "Increase team count"
        },
        "review": {
          "ready": "YOU'RE READY TO HUNT!",
          "start_hunt": "START BUG HUNT",
          "summary": "Session Summary",
          "mode_label": "Mode:",
          "participants_label": "Participants:",
          "teams_label": "Teams:",
          "go_to_setup": "Go to Setup",
          "back_to_setup": "BACK TO SETUP",
          "back_to_setup_desc": "Return to participants and mode selection"
        }
      },
      "leaderboard": {
        "title": "PLAY AREA",
        "header_title": "LIVE BUG HUNT",
        "privacy_line1": "No data is stored by this service.",
        "privacy_line2": "Download your JSON file to continue later.",
        "leaders_title": "CURRENT LEADERS",
        "leader_title": "CURRENT LEADER",
        "multiple_leaders": "Multiple Leaders",
        "status_not_started": "Not started",
        "status_running": "Running",
        "status_paused": "Paused",
        "visible_entries": "VISIBLE ENTRIES",
        "show_all_teams": "Show all teams",
        "show_all_participants": "Show all participants",
        "showing_label": "Showing {{label}}",
        "visibility_label": "VISIBILITY:",
        "helper_has_entries": "Use + to add bugs, − to subtract. Rankings update automatically.",
        "helper_no_entries": "No participants yet. Go to Setup to add participants.",
        "metrics": {
          "bugs_found": "TOTAL BUGS FOUND",
          "bugs_across_teams": "Across all teams",
          "bugs_across_participants": "Across all participants",
          "active_hunters": "ACTIVE HUNTERS",
          "time_elapsed": "TIME ELAPSED"
        },
        "timer": {
          "start": "START",
          "pause": "PAUSE",
          "resume": "RESUME",
          "reset": "RESET",
          "status_not_started": "NOT STARTED",
          "status_running": "RUNNING",
          "status_paused": "PAUSED",
          "label": "BUG HUNT TIMER",
          "ende": "ENDE",
          "ende_aria": "Stop and reset timer"
        },
        "visibility": {
          "label": "VISIBILITY:",
          "all": "SHOW ALL",
          "top3": "TOP 3 ONLY",
          "top10": "TOP 10 ONLY",
          "top5": "TOP 5 ONLY",
          "hidden": "HIDE SCORES"
        },
        "actions": {
          "export": "EXPORT SESSION",
          "close": "CLOSE SESSION"
        },
        "empty": "No data to display yet.",
        "no_entries": "No entries yet",
        "no_entries_body": "Add participants in Setup before the hunt begins. Choose individual or team-based competition.",
        "setup_individual": "SETUP INDIVIDUAL BUG HUNT",
        "setup_team": "SETUP TEAM-BASED BUG HUNT",
        "rank": "RANK",
        "hunter": "HUNTER",
        "team": "TEAM",
        "bugs": "BUGS",
        "bugs_singular": "BUG",
        "member_count": "{{count}} members",
        "members_label": "Members:",
        "add_bug_aria": "Add bug to {{name}}",
        "remove_bug_aria": "Remove bug from {{name}}",
        "bug_count_one": "{{count}} bug",
        "bug_count_other": "{{count}} bugs",
        "tie_summary": "{{count}} tied at {{bugs}} bugs"
      },
      "contact": {
        "title": "SUPPORT",
        "subtitle": "Get help for exploratory sessions, hoster setup, and bug hunt planning.",
        "form": {
          "title": "REQUEST SUPPORT",
          "name": "Full Name",
          "email": "Email Address",
          "company": "Company / Team",
          "optional": "(optional)",
          "subject": "Subject",
          "message": "Message",
          "send": "SEND REQUEST",
          "sending": "SENDING...",
          "clear": "CLEAR",
          "success": "Thank you! Your support request has been sent successfully.",
          "error_name": "Full name is required.",
          "error_email": "Email address is required.",
          "error_email_invalid": "Please enter a valid email address.",
          "error_subject": "Subject is required.",
          "error_message": "Message is required.",
          "server_error_default": "Failed to send message.",
          "placeholder_name": "Enter your full name",
          "placeholder_email": "name@example.com",
          "placeholder_company": "Enter your company or team",
          "placeholder_subject": "What do you need help with?",
          "placeholder_message": "Describe your issue or the setup support you need..."
        },
        "details": {
          "title": "SUPPORT DETAILS",
          "email_label": "Support Email",
          "response_time_label": "Response Time",
          "response_time_value": "Typically within 2 business days",
          "availability_label": "Availability",
          "availability_value": "Mon–Fri"
        },
        "resources": {
          "title": "SUPPORT RESOURCES"
        },
        "data_privacy": {
          "title": "DATA & PRIVACY",
          "text": "Live Bug Hunt does not automatically store bug hunt data on any server. JSON export/import is the only persistence mechanism available."
        },
        "links": {
          "title": "Helpful Links",
          "guide": "User Guide",
          "setup_tips": "Setup Tips",
          "privacy": "Privacy Notice"
        }
      },
      "modals": {
        "close": {
          "title": "Close this session?",
          "body": "You are about to leave the current bug hunt session. You will return to the start screen where you can start a new bug hunt or load a previously exported JSON session.",
          "warning_title": "All data in this session will be permanently lost.",
          "warning_subtext": "This application does not automatically store or recover session data.",
          "export_reminder": "To continue this bug hunt later, export the session as a JSON file before closing.",
          "btn_stay_label": "STAY IN SESSION",
          "btn_stay_helper": "Return to the current play area",
          "btn_export_label": "EXPORT & CLOSE",
          "btn_export_helper": "Download JSON and return to start screen",
          "btn_close_label": "CLOSE WITHOUT SAVING",
          "btn_close_helper": "Discard all current progress",
          "footer": "No data is stored automatically. Export is the only way to save your session."
        },
        "privacy": {
          "title": "Privacy Notice",
          "subtitle": "Your privacy is important. This application is designed with privacy by design.",
          "info_box": "This application does not automatically collect, store, or transmit any personal data. All information entered remains on your device for the duration of your browser session only.",
          "footer": "By using this application, you acknowledge that this privacy notice is informational and does not replace legal, compliance, or security review.",
          "sections": [
            {
              "title": "In-Browser Operation",
              "text": "This application runs entirely within your web browser. All session data, participant information, and bug counts are processed locally on your device and are never sent to any external server or third party."
            },
            {
              "title": "No Automatic Data Storage",
              "text": "This application does not use cookies, local storage, session storage, or any other browser persistence mechanism. When you close or refresh the browser tab, all session data is permanently lost unless you have exported it manually."
            },
            {
              "title": "No Data Sharing",
              "text": "No personal data, session data, or usage information is transmitted to or shared with any third party, including the application developer. There is no backend, no database, and no network communication of any kind."
            },
            {
              "title": "Local JSON Export",
              "text": "The only data persistence mechanism available is the manual JSON export feature. Exported files are saved directly to your local device. You are responsible for the storage, handling, and security of any exported files."
            },
            {
              "title": "No Tracking or Analytics",
              "text": "This application does not include any tracking scripts, analytics tools, advertising pixels, or telemetry of any kind. Your usage of the application is entirely private."
            },
            {
              "title": "Important Disclaimers",
              "text": "This application is provided as-is for internal use in bug hunt sessions. It is not intended to process sensitive personal data. If your bug hunt session involves personal data of participants, ensure that your use complies with applicable data protection laws and your organisation's data governance policies."
            },
            {
              "title": "User Responsibility",
              "text": "You are responsible for ensuring that the data entered into this application is handled in accordance with your organisation's policies. Participant names and bug counts entered into this tool are your responsibility to manage appropriately."
            }
          ]
        },
        "guide": {
          "title": "User Guide",
          "subtitle": "Quick steps to set up and run your bug hunt session.",
          "tip_label": "Tip:",
          "tip_text": "A new session starts empty. If no participants or teams exist yet, the Play Area will guide you back to Setup.",
          "footer_text": "Need more help? Please use the Send a Message form on this page",
          "steps": [
            {
              "title": "Choose a Mode",
              "text": "Open the Setup page and choose Individual or Team-based mode."
            },
            {
              "title": "Add Participants",
              "text": "Enter participants. In Team-based mode, create or auto-shuffle teams and adjust names if needed."
            },
            {
              "title": "Save & Go to Play Area",
              "text": "Save your setup to populate the play area. Existing rankings and unaffected scores stay intact when you make later setup changes."
            },
            {
              "title": "Track Bugs Live",
              "text": "Use the + and − controls to add or subtract bugs. Tied scores share the same rank."
            },
            {
              "title": "Use Timer & Visibility",
              "text": "Start, pause, or end the timer. Filter the play area by All, Top 3, or Top 10."
            },
            {
              "title": "Export Before Closing",
              "text": "No data is stored automatically. Export your session as JSON if you want to continue later."
            }
          ]
        },
        "tips": {
          "title": "Bug Hunt Setup Tips",
          "subtitle": "Short guidance for planning and running an effective exploratory bug hunt.",
          "footer_text": "Need tailored support? Request a consultation or bug hunt session using the Send a Message form on this page.",
          "items": [
            {
              "title": "Prepare Access",
              "text": "Make sure every participant can access the system under test before the session starts."
            },
            {
              "title": "Clarify Missions",
              "text": "Explain the test missions clearly so everyone knows what to explore."
            },
            {
              "title": "Provide Charters",
              "text": "Have charters or focus areas ready to guide the bug hunt without over-constraining participants."
            },
            {
              "title": "Set Up Bug Reporting",
              "text": "Use a reporting tool such as MS Forms, MS Teams, Power Apps, ServiceNow, Pega, or another agreed system. Make sure everyone knows how to use it."
            },
            {
              "title": "Capture Key Bug Details",
              "text": "Record essentials such as summary, steps to reproduce, environment, evidence, severity, and impact."
            },
            {
              "title": "Explain Scoring",
              "text": "Make sure it is clear how points are assigned. This tool tracks bug counts and helps manage the session and winner only."
            },
            {
              "title": "Keep It Exploratory",
              "text": "Let participants have fun and avoid over-constraining them. Exploration works best with room to think."
            },
            {
              "title": "Plan and Motivate",
              "text": "Have a bug hunt strategy, cover the important planning aspects, include prizes or incentives, and keep participants engaged."
            }
          ]
        }
      },
      "messages": {
        "leave_warning": "Leave this page? Session data is not stored automatically and will be lost unless you exported it.",
        "session_closed": "Session closed. Don't forget to export if you need the data!",
        "import_error": "Failed to import session. Invalid file format."
      }
    }
  },
  de: {
    translation: {
      "common": {
        "version": "Version 1.1.0",
        "page_sections": "Seitenbereiche",
        "language": "Sprache",
        "cancel": "ABBRECHEN",
        "save": "SPEICHERN",
        "edit": "BEARBEITEN",
        "delete": "LÖSCHEN",
        "remove": "ENTFERNEN",
        "confirm": "BESTÄTIGEN",
        "back": "ZURÜCK",
        "continue": "WEITER",
        "acknowledge_continue": "BESTÄTIGEN & WEITER",
        "export_session": "SESSION EXPORTIEREN (JSON)",
        "close_session": "SESSION BEENDEN"
      },
      "landing": {
        "title": "LIVE BUG HUNT",
        "subtitle": "Ein kostenloses, spielerisches Test-Tool für Live-Exploratory-Test-Sessions.\nErstellen Sie eine Session, projizieren Sie diese auf den Bildschirm und motivieren Sie Teams, gemeinsam Fehler zu finden.",
        "start_new": "NEUE SESSION STARTEN",
        "start_new_desc": "Starten Sie eine neue Bug Hunt von Grund auf.",
        "import_existing": "EXISTIERENDE SESSION IMPORTIEREN",
        "import_existing_desc": "Setzen Sie eine zuvor exportierte Session fort (.json).",
        "privacy_title": "100% Client-Side & Datenschutz-fokussiert",
        "privacy_desc": "Alle Daten bleiben im Speicher Ihres Browsers. Wir haben keine Datenbank und verfolgen Ihre Fehler nicht.",
        "privacy_desc_2": "Zum späteren Fortsetzen exportieren Sie Ihre Sitzung als JSON-Datei und importieren Sie sie bei der Rückkehr erneut.",
        "privacy_desc_3": "Bewahren Sie Ihre JSON-Datei sicher auf - nur so kann die Sitzung wiederhergestellt werden.",
        "disclaimer_title": "Nutzungshinweis",
        "disclaimer_body_1": "Diese Anwendung wird kostenlos auf einer \"wie besehen\" und \"wie verfügbar\" Basis bereitgestellt, ohne Gewährleistungen jeglicher Art.",
        "disclaimer_body_2": "Soweit gesetzlich zulässig, ist der Eigentümer nicht verantwortlich für direkte, indirekte, zufällige, Folgeschäden, spezielle, geschäftliche Schäden, Datenverlust oder andere Schäden, die aus der Nutzung, der Unfähigkeit zur Nutzung, Fehlfunktionen, Unterbrechungen, Fehlern, Abstürzen, Wertminderungen oder Nichtverfügbarkeit dieser Anwendung resultieren.",
        "disclaimer_body_3": "Es werden keine Bug-Hunt-Sitzungsdaten automatisch von diesem Dienst gespeichert. Wenn Sitzungsdaten verloren gehen, nicht gespeichert, überschrieben, beschädigt oder nicht verfügbar sind, können sie vom Eigentümer oder der Anwendung nicht wiederhergestellt werden.",
        "disclaimer_body_4": "Sie sind verantwortlich für die angemessene Nutzung des Bug Hunt Applications, für die Einhaltung geltender Gesetze und Organisationsrichtlinien sowie für den Export aller Sitzungsdaten als JSON, wenn Sie diese später speichern oder fortsetzen möchten.",
        "disclaimer_body_5": "Durch Fortfahren bestätigen Sie, dass Sie diese Anwendung auf eigenes Risiko nutzen und dass Sie für die korrekte Nutzung der Anwendung und für das Speichern aller Daten, die Sie behalten möchten, verantwortlich sind.",
        "disclaimer_agree": "Ich bestätige, dass ich diese Anwendung auf eigenes Risiko nutze und dass ich für das Speichern aller Daten, die ich behalten möchte, verantwortlich bin.",
        "start_card": {
          "title": "NEUE BUG HUNT STARTEN",
          "desc": "Erstellen Sie einen neuen Spielbereich von Grund auf.",
          "feature_1": "Teams oder Teilnehmer einrichten",
          "feature_2": "Bugs in Echtzeit verfolgen",
          "feature_3": "Session als JSON exportieren",
          "button": "NEUE SESSION STARTEN"
        },
        "import_card": {
          "title": "VORHANDENE BUG HUNT LADEN",
          "desc": "Importieren Sie eine zuvor exportierte JSON-Datei.",
          "feature_1": "Machen Sie dort weiter, wo Sie aufgehört haben",
          "feature_2": "Alle Daten werden wiederhergestellt",
          "feature_3": "Es werden keine Daten automatisch gespeichert",
          "validating": "Validiere {{fileName}}...",
          "error_title": "Session konnte nicht geladen werden",
          "success_text": "erfolgreich validiert.",
          "choose_another": "Andere Datei wählen",
          "button": "SESSION LADEN",
          "dropzone": {
            "idle": "Ziehen Sie eine .json-Sitzungsdatei hierher oder klicken Sie zum Durchsuchen",
            "active": "Datei hier ablegen...",
            "click": "Klicken Sie, um eine JSON-Datei auszuwählen",
            "or_drag": "oder hierher ziehen und ablegen"
          }
        }
      },
      "setup": {
        "title": "SESSION-SETUP",
        "subtitle_individual": "Konfigurieren Sie Ihre Bug Hunt vor dem Start. Fügen Sie Teilnehmer hinzu und wählen Sie den Modus.",
        "subtitle_team": "Konfigurieren Sie Ihre Bug Hunt vor dem Start. Fügen Sie Teilnehmer hinzu, erstellen Sie Teams und passen Sie die Einstellungen an.",
        "reset_session": "SESSION ZURÜCKSETZEN",
        "save_go": "SPEICHERN & ZUM SPIELBEREICH",
        "error_no_participants": "Fügen Sie mindestens einen Teilnehmer hinzu, um fortzufahren.",
        "error_no_teams": "Erstellen Sie mindestens ein Team, um fortzufahren.",
        "confirm_reset": "SIND SIE SICHER? DIES LÖSCHT ALLES.",
        "add_participants": {
          "title": "1. TEILNEHMER HINZUFÜGEN",
          "helper": "Geben Sie einen Namen pro Zeile ein oder trennen Sie diese durch Kommas.",
          "placeholder": "Elias, Linus, ...\nNelio",
          "tip": "Sie können Namen aus Tabellenkalkulationen oder Listen kopieren.",
          "add_btn": "TEILNEHMER HINZUFÜGEN",
          "add_demo": "DEMODATEN HINZUFÜGEN",
          "clear_all": "ALLE LÖSCHEN",
          "confirm_clear": "Sind Sie sicher?",
          "yes_clear": "Ja, löschen",
          "cancel": "Abbrechen"
        },
        "tabs": {
          "mode": "1. MODUS",
          "participants": "2. TEILNEHMER",
          "teams": "3. TEAMS",
          "review": "4. ÜBERSICHT"
        },
        "mode": {
          "title": "JAGDMODUS WÄHLEN",
          "label": "Modus",
          "individual": "Einzeln (Deathmatch)",
          "team": "Teambasiert",
          "individual_hint": "Jeder kämpft einzeln.",
          "team_hint": "Teilnehmer werden in Teams gruppiert.",
          "individual_card": "INDIVIDUALMODUS",
          "individual_desc": "Jeder Teilnehmer kämpft für sich selbst.",
          "team_card": "TEAMMODUS",
          "team_desc": "Teilnehmer werden in Teams gruppiert. Die Punkte werden addiert."
        },
        "participants": {
          "title": "TEILNEHMER HINZUFÜGEN",
          "desc": "Geben Sie die Namen der Personen ein, die an der Jagd teilnehmen.",
          "placeholder": "Namen eingeben (einer pro Zeile oder durch Komma getrennt)...",
          "add_button": "TEILNEHMER HINZUFÜGEN",
          "add_demo": "DEMODATEN HINZUFÜGEN",
          "clear_all": "ALLE LÖSCHEN",
          "manage_title": "TEILNEHMER VERWALTEN",
          "manage_desc": "Teilnehmer überprüfen, bearbeiten oder entfernen.",
          "empty": "Noch keine Teilnehmer hinzugefügt.",
          "table_num": "#",
          "table_name": "TEILNEHMER",
          "table_actions": "AKTIONEN"
        },
        "teams": {
          "title": "TEAMZUTEILUNG",
          "auto_title": "2. TEAMS ZUWEISEN (Auto)",
          "auto_desc": "Teilnehmer automatisch auf Teams verteilen.",
          "num_teams": "Anzahl der Teams",
          "shuffle": "TEAMS AUTOMATISCH MISCHEN",
          "manage_title": "4. TEAMS VERWALTEN",
          "manage_desc": "Überprüfen und bearbeiten Sie die Teams. Sie können Teamnamen ändern und Teilnehmer zwischen Teams verschieben.",
          "add_member": "Mitglied hinzufügen",
          "no_teams": "Nutzen Sie \"TEAMS AUTOMATISCH MISCHEN\", um Teams zu erstellen.",
          "members": "Mitglieder",
          "add_member_aria": "Mitglied zu Team hinzufügen",
          "remove_member_aria": "Mitglied von Team entfernen",
          "delete_team_aria": "Team löschen",
          "edit_team_name_aria": "Teamnamen bearbeiten",
          "auto_note": "Die Teilnehmer werden so gleichmäßig wie möglich verteilt.",
          "drag_hint": "Teilnehmer per Drag-and-drop zwischen Teams verschieben.",
          "stepper_dec_aria": "Teamanzahl verringern",
          "stepper_inc_aria": "Teamanzahl erhöhen"
        },
        "review": {
          "ready": "BEREIT FÜR DIE JAGD!",
          "start_hunt": "BUG HUNT STARTEN",
          "summary": "Session-Zusammenfassung",
          "mode_label": "Modus:",
          "participants_label": "Teilnehmer:",
          "teams_label": "Teams:",
          "go_to_setup": "Zum Setup",
          "back_to_setup": "ZURÜCK ZUM SETUP",
          "back_to_setup_desc": "Zurück zur Teilnehmer- und Moduswahl"
        }
      },
      "leaderboard": {
        "title": "SPIELBEREICH",
        "header_title": "LIVE BUG HUNT",
        "privacy_line1": "Es werden keine Daten von diesem Dienst gespeichert.",
        "privacy_line2": "Laden Sie Ihre JSON-Datei herunter, um später fortzufahren.",
        "leaders_title": "AKTUELLE FÜHRER",
        "leader_title": "AKTUELLER FÜHRER",
        "multiple_leaders": "Mehrere Führende",
        "status_not_started": "Nicht gestartet",
        "status_running": "Läuft",
        "status_paused": "Pausiert",
        "visible_entries": "SICHTBARE EINTRÄGE",
        "show_all_teams": "Alle Teams anzeigen",
        "show_all_participants": "Alle Teilnehmer anzeigen",
        "showing_label": "Anzeige: {{label}}",
        "visibility_label": "SICHTBARKEIT:",
        "helper_has_entries": "Nutzen Sie + um Bugs hinzuzufügen, − zum Abziehen. Das Ranking wird automatisch aktualisiert.",
        "helper_no_entries": "Noch keine Teilnehmer. Gehen Sie zum Setup, um Teilnehmer hinzuzufügen.",
        "metrics": {
          "bugs_found": "GEFUNDENE BUGS INSGESAMT",
          "bugs_across_teams": "Über alle Teams",
          "bugs_across_participants": "Über alle Teilnehmer",
          "active_hunters": "AKTIVE JÄGER",
          "time_elapsed": "VERGANGENE ZEIT"
        },
        "timer": {
          "start": "START",
          "pause": "PAUSE",
          "resume": "FORTSETZEN",
          "reset": "ZURÜCKSETZEN",
          "status_not_started": "NICHT GESTARTET",
          "status_running": "LÄUFT",
          "status_paused": "PAUSIERT",
          "label": "BUG HUNT TIMER",
          "ende": "ENDE",
          "ende_aria": "Timer stoppen und zurücksetzen"
        },
        "visibility": {
          "label": "SICHTBARKEIT:",
          "all": "ALLE ANZEIGEN",
          "top3": "NUR TOP 3",
          "top10": "NUR TOP 10",
          "top5": "NUR TOP 5",
          "hidden": "PUNKTE AUSBLENDEN"
        },
        "actions": {
          "export": "SESSION EXPORTIEREN",
          "close": "SESSION BEENDEN"
        },
        "empty": "Noch keine Daten vorhanden.",
        "no_entries": "Noch keine Einträge",
        "no_entries_body": "Fügen Sie im Setup Teilnehmer hinzu, bevor die Jagd beginnt. Wählen Sie zwischen Einzel- oder Teamwettbewerb.",
        "setup_individual": "EINZEL-BUG-HUNT EINRICHTEN",
        "setup_team": "TEAM-BUG-HUNT EINRICHTEN",
        "rank": "RANG",
        "hunter": "JÄGER",
        "team": "TEAM",
        "bugs": "BUGS",
        "bugs_singular": "BUG",
        "member_count": "{{count}} Mitglieder",
        "members_label": "Mitglieder:",
        "add_bug_aria": "Bug für {{name}} hinzufügen",
        "remove_bug_aria": "Bug für {{name}} abziehen",
        "bug_count_one": "{{count}} Bug",
        "bug_count_other": "{{count}} Bugs",
        "tie_summary": "{{count}} gleichauf bei {{bugs}} Bugs"
      },
      "contact": {
        "title": "HILFE",
        "subtitle": "Holen Sie sich Hilfe für explorative Sessions, das Hoster-Setup und die Bug-Hunt-Planung.",
        "form": {
          "title": "HILFE ANFORDERN",
          "name": "Vollständiger Name",
          "email": "E-Mail-Adresse",
          "company": "Unternehmen / Team",
          "optional": "(optional)",
          "subject": "Betreff",
          "message": "Nachricht",
          "send": "ANFRAGE SENDEN",
          "sending": "WIRD GESENDET...",
          "clear": "LÖSCHEN",
          "success": "Vielen Dank! Ihre Hilfe-Anfrage wurde erfolgreich gesendet.",
          "error_name": "Vollständiger Name ist erforderlich.",
          "error_email": "E-Mail-Adresse ist erforderlich.",
          "error_email_invalid": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
          "error_subject": "Betreff ist erforderlich.",
          "error_message": "Nachricht ist erforderlich.",
          "server_error_default": "Nachricht konnte nicht gesendet werden.",
          "placeholder_name": "Geben Sie Ihren vollständigen Namen ein",
          "placeholder_email": "name@beispiel.de",
          "placeholder_company": "Geben Sie Ihr Unternehmen oder Team ein",
          "placeholder_subject": "Wobei benötigen Sie Hilfe?",
          "placeholder_message": "Beschreiben Sie Ihr Anliegen oder die benötigte Unterstützung..."
        },
        "details": {
          "title": "HILFE-DETAILS",
          "email_label": "Hilfe-E-Mail",
          "response_time_label": "Antwortzeit",
          "response_time_value": "Normalerweise innerhalb von 2 Werktagen",
          "availability_label": "Verfügbarkeit",
          "availability_value": "Mo–Fr"
        },
        "resources": {
          "title": "HILFE-RESSOURCEN"
        },
        "data_privacy": {
          "title": "DATEN & DATENSCHUTZ",
          "text": "Live Bug Hunt speichert Bug-Hunt-Daten nicht automatisch auf einem Server. Der JSON-Export/-Import ist der einzige verfügbare Mechanismus zur Datensicherung."
        },
        "links": {
          "title": "Hilfreiche Links",
          "guide": "Benutzerhandbuch",
          "setup_tips": "Setup-Tipps",
          "privacy": "Datenschutzhinweis"
        }
      },
      "modals": {
        "close": {
          "title": "Sitzung beenden?",
          "body": "Sie sind im Begriff, die aktuelle Bug-Hunt-Sitzung zu verlassen. Sie kehren zum Startbildschirm zurück, wo Sie eine neue Bug Hunt starten oder eine zuvor exportierte JSON-Sitzung laden können.",
          "warning_title": "Alle Daten in dieser Sitzung gehen dauerhaft verloren.",
          "warning_subtext": "Diese Anwendung speichert oder stellt Sitzungsdaten nicht automatisch wieder her.",
          "export_reminder": "Um diese Bug Hunt später fortzusetzen, exportieren Sie die Sitzung vor dem Schließen als JSON-Datei.",
          "btn_stay_label": "IN SITZUNG BLEIBEN",
          "btn_stay_helper": "Zurück zum aktuellen Spielbereich",
          "btn_export_label": "EXPORTIEREN & BEENDEN",
          "btn_export_helper": "JSON herunterladen und zum Startbildschirm zurückkehren",
          "btn_close_label": "OHNE SPEICHERN BEENDEN",
          "btn_close_helper": "Alle aktuellen Fortschritte verwerfen",
          "footer": "Es werden keine Daten automatisch gespeichert. Export ist der einzige Weg, Ihre Sitzung zu sichern."
        },
        "privacy": {
          "title": "Datenschutzhinweis",
          "subtitle": "Ihre Privatsphäre ist wichtig. Diese Anwendung wurde mit dem Prinzip \"Privacy by Design\" entwickelt.",
          "info_box": "Diese Anwendung sammelt, speichert oder überträgt keine personenbezogenen Daten automatisch. Alle eingegebenen Informationen verbleiben nur für die Dauer Ihrer Browsersitzung auf Ihrem Gerät.",
          "footer": "Durch die Nutzung dieser Anwendung erkennen Sie an, dass dieser Datenschutzhinweis nur zu Informationszwecken dient und keine rechtliche, Compliance- oder Sicherheitsüberprüfung ersetzt.",
          "sections": [
            {
              "title": "In-Browser-Betrieb",
              "text": "Diese Anwendung läuft vollständig in Ihrem Webbrowser. Alle Sitzungsdaten, Teilnehmerinformationen und Bug-Zahlen werden lokal auf Ihrem Gerät verarbeitet und niemals an einen externen Server oder Dritte gesendet."
            },
            {
              "title": "Keine automatische Datenspeicherung",
              "text": "Diese Anwendung verwendet keine Cookies, Local Storage, Session Storage oder andere Browser-Persistenzmechanismen. Wenn Sie den Browser-Tab schließen oder aktualisieren, gehen alle Sitzungsdaten dauerhaft verloren, sofern Sie diese nicht manuell exportiert haben."
            },
            {
              "title": "Keine Datenweitergabe",
              "text": "Es werden keine personenbezogenen Daten, Sitzungsdaten oder Nutzungsinformationen an Dritte übertragen oder mit diesen geteilt, auch nicht mit dem Entwickler der Anwendung. Es gibt kein Backend, keine Datenbank und keine Netzwerkkommunikation jeglicher Art."
            },
            {
              "title": "Lokaler JSON-Export",
              "text": "Der einzige verfügbare Mechanismus zur Datensicherung ist die manuelle JSON-Exportfunktion. Exportierte Dateien werden direkt auf Ihrem lokalen Gerät gespeichert. Sie sind für die Speicherung, Handhabung und Sicherheit aller exportierten Dateien verantwortlich."
            },
            {
              "title": "Kein Tracking oder Analytics",
              "text": "Diese Anwendung enthält keine Tracking-Skripte, Analyse-Tools, Werbepixel oder Telemetrie jeglicher Art. Ihre Nutzung der Anwendung ist vollständig privat."
            },
            {
              "title": "Wichtige Haftungsausschlüsse",
              "text": "Diese Anwendung wird so bereitgestellt, wie sie ist, für die interne Verwendung in Bug-Hunt-Sitzungen. Sie ist nicht dazu gedacht, sensible personenbezogene Daten zu verarbeiten. Wenn Ihre Bug-Hunt-Sitzung personenbezogene Daten von Teilnehmern beinhaltet, stellen Sie sicher, dass Ihre Nutzung den geltenden Datenschutzgesetzen und den Data-Governance-Richtlinien Ihrer Organisation entspricht."
            },
            {
              "title": "Benutzerverantwortung",
              "text": "Sie sind dafür verantwortlich, dass die in diese Anwendung eingegebenen Daten gemäß den Richtlinien Ihrer Organisation behandelt werden. Teilnehmernamen und Bug-Zahlen, die in dieses Tool eingegeben werden, liegen in Ihrer Verantwortung und müssen angemessen verwaltet werden."
            }
          ]
        },
        "guide": {
          "title": "Benutzerhandbuch",
          "subtitle": "Schnelle Schritte zum Einrichten und Durchführen Ihrer Bug-Hunt-Sitzung.",
          "tip_label": "Tipp:",
          "tip_text": "Eine neue Sitzung startet leer. Wenn noch keine Teilnehmer oder Teams existieren, führt Sie der Spielbereich zurück zum Setup.",
          "footer_text": "Benötigen Sie weitere Hilfe? Bitte nutzen Sie das Formular \"Nachricht senden\" auf dieser Seite.",
          "steps": [
            {
              "title": "Modus wählen",
              "text": "Öffnen Sie die Setup-Seite und wählen Sie den Einzel- oder Team-Modus."
            },
            {
              "title": "Teilnehmer hinzufügen",
              "text": "Geben Sie die Teilnehmer ein. Erstellen oder mischen Sie im Team-Modus Teams und passen Sie die Namen bei Bedarf an."
            },
            {
              "title": "Speichern & zum Spielbereich",
              "text": "Speichern Sie Ihr Setup, um den Spielbereich zu füllen. Bestehende Rankings und nicht betroffene Scores bleiben bei späteren Setup-Änderungen erhalten."
            },
            {
              "title": "Bugs live verfolgen",
              "text": "Nutzen Sie die + und − Steuerelemente, um Bugs hinzuzufügen oder abzuziehen. Gleiche Punktzahlen teilen sich denselben Rang."
            },
            {
              "title": "Timer & Sichtbarkeit nutzen",
              "text": "Starten, pausieren oder beenden Sie den Timer. Filtern Sie den Spielbereich nach Alle, Top 3 oder Top 10."
            },
            {
              "title": "Vor dem Schließen exportieren",
              "text": "Es werden keine Daten automatisch gespeichert. Exportieren Sie Ihre Sitzung als JSON, wenn Sie später fortfahren möchten."
            }
          ]
        },
        "tips": {
          "title": "Bug-Hunt-Setup-Tipps",
          "subtitle": "Kurze Anleitung für die Planung und Durchführung einer effektiven explorativen Bug Hunt.",
          "footer_text": "Benötigen Sie maßgeschneiderte Unterstützung? Fordern Sie eine Beratung oder Bug-Hunt-Sitzung über das Formular \"Nachricht senden\" auf dieser Seite an.",
          "items": [
            {
              "title": "Zugang vorbereiten",
              "text": "Stellen Sie sicher, dass jeder Teilnehmer vor Beginn der Sitzung Zugang zum Testsystem hat."
            },
            {
              "title": "Missionen klären",
              "text": "Erklären Sie die Testmissionen klar, damit jeder weiß, was zu untersuchen ist."
            },
            {
              "title": "Charter bereitstellen",
              "text": "Halten Sie Charter oder Fokusbereiche bereit, um die Bug Hunt zu leiten, ohne die Teilnehmer zu sehr einzuschränken."
            },
            {
              "title": "Bug-Reporting einrichten",
              "text": "Verwenden Sie ein Reporting-Tool wie MS Forms, MS Teams, Power Apps, ServiceNow, Pega oder ein anderes vereinbartes System. Stellen Sie sicher, dass jeder weiß, wie man es benutzt."
            },
            {
              "title": "Wichtige Bug-Details erfassen",
              "text": "Erfassen Sie das Wesentliche wie Zusammenfassung, Schritte zur Reproduktion, Umgebung, Beweise, Schweregrad und Auswirkungen."
            },
            {
              "title": "Bewertung erklären",
              "text": "Stellen Sie sicher, dass klar ist, wie Punkte vergeben werden. Dieses Tool dient nur zur Erfassung der Bug-Zahl und hilft bei der Verwaltung der Sitzung und des Gewinners."
            },
            {
              "title": "Explorativ bleiben",
              "text": "Lassen Sie die Teilnehmer Spaß haben und vermeiden Sie es, sie zu sehr einzuschränken. Exploration funktioniert am besten mit Freiraum zum Denken."
            },
            {
              "title": "Planen und motivieren",
              "text": "Haben Sie eine Bug-Hunt-Strategie, decken Sie die wichtigen Planungsaspekte ab, planen Sie Preise oder Anreize ein und halten Sie die Teilnehmer bei der Stange."
            }
          ]
        }
      },
      "messages": {
        "leave_warning": "Diese Seite verlassen? Sitzungsdaten werden nicht automatisch gespeichert und gehen verloren, wenn Sie sie nicht exportiert haben.",
        "session_closed": "Sitzung beendet. Vergessen Sie nicht zu exportieren, falls Sie die Daten benötigen!",
        "import_error": "Import fehlgeschlagen. Ungültiges Dateiformat."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['path', 'cookie', 'htmlTag', 'localStorage', 'subdomain'],
      lookupFromPathIndex: 0,
    }
  });

export default i18n;
