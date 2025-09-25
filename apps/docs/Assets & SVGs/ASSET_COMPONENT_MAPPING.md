> **DEPRECATED:** This document is retained for historical reference only. The mapping table below is preserved for legacy asset/component tracking. See README.md and docs/ for current mapping and status.

# Asset to Component Mapping Table (Phase 5)

| Source Asset (SVG/PNG) | Component Name | Type | Destination | Export Path | Use Case | Theming/Notes |
|------------------------|---------------|------|-------------|-------------|----------|---------------|
| Apps - Home.svg | NavHomeIcon | icon | core/src/icons/ | icons/NavHomeIcon | Sidebar/Home | glass color, accent |
| Apps - Community.svg | NavCommunityIcon | icon | core/src/icons/ | icons/NavCommunityIcon | Community hub | accent, glow |
| Apps - Your Apps.svg | NavYourAppsIcon | icon | core/src/icons/ | icons/NavYourAppsIcon | User apps | neutral, accent |
| Chats - Layout V1.svg | ChatLayoutV1 | layout | core/src/components/chat/ | components/chat/ChatLayoutV1 | 2-pane chat | surface tokens |
| Chats - Layout V2.svg | ChatLayoutV2 | layout | core/src/components/chat/ | components/chat/ChatLayoutV2 | alt layout | surface tokens |
| Chat Message Sidebar - Apps.svg | ChatSidebarAppsSectionIcon | icon | core/src/icons/ | icons/ChatSidebarAppsSectionIcon | Sidebar section | on-surface-subtle |
| Chat Message Sidebar - Create Note.svg | ChatSidebarNoteIcon | icon | core/src/icons/ | icons/ChatSidebarNoteIcon | Notes | accent hover |
| Chat Message Sidebar - Media & Files.svg | ChatSidebarMediaIcon | icon | core/src/icons/ | icons/ChatSidebarMediaIcon | Media tab | accent gradient |
| Chat Message Sidebar - Photos.svg | ChatSidebarPhotosIcon | icon | core/src/icons/ | icons/ChatSidebarPhotosIcon | Photos tab | accent ring |
| Logic Builder.svg | LogicBuilderCanvas | feature | core/src/components/logic/ | components/logic/LogicBuilderCanvas | Node flow | surface-alt |
| Logic Builder - Empty.svg | LogicBuilderEmptyState | empty | core/src/components/logic/ | components/logic/LogicBuilderEmptyState | Placeholder | dashed border |
| Popup - Create Template.svg | CreateTemplateModalLayout | modal | core/src/components/modals/ | components/modals/CreateTemplateModalLayout | Template creation | glass panel |
| Popup - Prompt Library.svg | PromptLibraryModalLayout | modal | core/src/components/modals/ | components/modals/PromptLibraryModalLayout | Prompt library | glass panel |
| Promp Library - Community.svg | PromptLibraryCommunityIcon | icon | core/src/icons/ | icons/PromptLibraryCommunityIcon | Community filter | accent fill |
| Promp Library - Edit Prompt.svg | PromptEditIcon | icon | core/src/icons/ | icons/PromptEditIcon | Edit | focus color |
| Prompt Library - Folders.svg | PromptFolderIcon | icon | core/src/icons/ | icons/PromptFolderIcon | Folder tree | accent selection |
| Dark Mode@2x.svg | ThemeDarkModeIcon | icon | core/src/icons/ | icons/ThemeDarkModeIcon | Theme toggle | dual-tone |
| Checkbox-ON-OFF.png | HaloCheckbox | form | core/src/components/form/ | components/form/HaloCheckbox | Checkbox | CSS token shadow |
| Rounded-Rectangle*.png | SurfaceButtonBase | primitive | core/src/components/primitives/ | components/primitives/SurfaceButtonBase | Button base | glass, accent |
| Tabs.png | TabsNav | navigation | core/src/components/navigation/ | components/navigation/TabsNav | Tabs | accent |
| Audio-player*.png | AudioPlayer | media | core/src/components/media/ | components/media/AudioPlayer | Audio UI | glass, accent |
| Volume.png | VolumeIcon | icon | core/src/icons/ | icons/VolumeIcon | Volume | accent |
| arrow.png | ArrowIcon | icon | core/src/icons/ | icons/ArrowIcon | Arrows | accent |
| chat-bubble.png | ChatBubbleIcon | icon | core/src/icons/ | icons/ChatBubbleIcon | Thread marker | accent |
| heart.png | HeartIcon | icon | core/src/icons/ | icons/HeartIcon | Reactions | accent |
| house.png | HouseIcon | icon | core/src/icons/ | icons/HouseIcon | Home | accent |
| ... | ... | ... | ... | ... | ... | ... |

- See README for full mapping and status.
- All icons/components should be recolored to match glass brand tokens.
