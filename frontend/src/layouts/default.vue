<template>
    <!-- Desktop view -->
    <div hidden md:flex flex-row justify-center w-full>
        <div w="4/5" gap-2 grid mt-14 xl:w="3/5" xl:gap-4 xl:mt-16 class="grid-cols-[0.5fr_2fr_0.5fr]">
            <ShortBio />
            <div>
                <NavigationBar />
                <router-view />
            </div>
            <RecentPosts />
        </div>
    </div>
    <!-- Mobile view -->
</template>