import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { isSameUrl, resolveUrl } from '@/lib/utils';
import { type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const page = usePage();
    return (
        <>
            {
                groups
                    .filter(group => group.items.some(item => item.visible))
                    .map((group) => (
                        <SidebarGroup key={group.title} className="px-2 py-0">
                            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    if (!item.visible) {
                                        return null;
                                    }
                                    const itemUrl = resolveUrl(item.href);
                                    const isActive = item.isActive !== undefined
                                        ? item.isActive
                                        : itemUrl === '/admin'
                                            ? isSameUrl(page.url, itemUrl)
                                            : page.url.startsWith(itemUrl);

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={{ children: item.title }}
                                            >
                                                <Link href={item.href} prefetch>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    ))
            }
        </>
    );
}
