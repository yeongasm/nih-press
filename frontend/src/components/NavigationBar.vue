<template>
    <!-- For desktop view -->
    <div hidden xl:flex flex-row justify-evenly bg-white rounded-lg border border-gray-200 py-2 mb-4>
        <Route to="/">Home</Route>
        <Route to="/resume">Resume</Route>
        <Route to="/projects">Projects</Route>
        <Route to="/articles">Articles</Route>
    </div>
    <!-- For mobile view -->
    <div xl:hidden>

    </div>
</template>
