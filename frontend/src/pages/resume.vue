<template>
  <div mb-5 flex flex-col md:grid md:grid-cols-2 md:gap-4>
    <SectionBody mb-5 md:mb-0>
      <Heading mb-4>Career Overview</Heading>
      <div flex flex-col justify-center items-start relative>
        <div absolute w-8 h-full flex flex-col justify-start items-center>
          <div w-4 h-4 bg-gray-700 rounded></div>
          <div w-4 h-4 bg-gray-700 rounded mt-auto></div>
        </div>
        <div v-for="career in careers" flex flex-row justify-start items-center w-full relative>
          <div absolute h-full w-8>
            <div relative h-full w-8 flex flex-row justify-center items-center>
              <div h-full bg-gray-700 w-px></div>
              <div absolute w-4 h-4 hover:w-6 hover:h-6 bg-gray-700 :class="career.hover_class" rounded-full transition-all></div>
            </div>
          </div>
          <div flex flex-row items-center justify-end w-full>
            <div bg-gray-700 grow h-px ml-4 transition-all></div>
            <WorkHistory
              w="4/5"
              :title="career.title"
              :company="career.company_name"
              :from="career.from"
              :to="career.to"
              :description="career.description"
            />
          </div>
        </div>
      </div>
    </SectionBody>
    <SectionBody>
      <Heading mb-2>Skills</Heading>
      <div flex flex-col justify-center items-start relative>
        <div v-for="skill in skills" flex flex-row justify-start items-center w-full relative>
          <div flex flex-row items-center justify-end w-full>
            <div rounded-xl pl-2 my-2 w-full>
              <SubHeading font-bold color-gray-600>{{ skill.title }}</SubHeading>
              <Text>{{ skill.description }}</Text>
              <ul my-1>
                <li v-for="content in skill.contents"><SmallText>{{ content }}</SmallText></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionBody>
  </div>
  <SectionBody mb-5>
    <Heading mb-2>Titles I've Worked On</Heading>
    <div flex flex-row justify-between items-center>
      <div v-for="game in games" p-2 my-2 flex flex-row flex-wrap justify-between items-center>
        <ImageContainer :img_url="game.imgUrl"/>
      </div>
    </div>
  </SectionBody>
  <div grid grid-rows-2 gap-5 md:flex md:flex-row md:justify-between md:items-start mb-5>
    <SectionBody class="md:w-[65%]">
      <Heading mb-2>Education</Heading>
      <SubHeading font-bold>Universiti Teknologi PETRONAS</SubHeading>
      <div flex flex-col items-start justify-center>
        <Text>Degree in Information and Communication Technology (Software Engineering)</Text>
        <SmallText>Minor in Business Management</SmallText>
      </div>
    </SectionBody>
    <SectionBody class="md:w-[25%]">
      <Heading mb-2>Human Languages</Heading>
      <div flex flex-col justify-between items-start>
        <Text>English</Text>
        <Text>Malay</Text>
        <Text>Mandarin</Text>
      </div>
    </SectionBody>
  </div>
  <Text v-if="resumeUrl.length" mb-3 text-center xl:text-left xl:mb-0>You can download my full resume <a :href="resumeUrl" text-blue-500 :download="filename" target="_blank">here.</a></Text>
</template>

<route>
{
  meta: {
    layout: "default"
  }
}
</route>

<script setup lang="ts">
import twWarhammerImgUrl from '@/assets/tww_logo.png';
import twWarhammer2ImgUrl from '@/assets/tww2_logo.png';
import tw3KingdomsImgUrl from '@/assets/tw3k_logo.png';
import { useUserStore } from '@/store/user.store';

const careers = reactive([
  {
    title: "Programmer",
    company_name: "Creative Assembly",
    from: "Feb 2022",
    to: "Present",
    description: "Working on foundation libraries while porting our previously Steam exclusive titles to the Microsoft Store and Epic Games Store.",
    hover_class: "hover-ocean"
  },
  {
    title: "Software Engineer",
    company_name: "Troopers Innovation",
    from: "Jan 2021",
    to: "Jan 2022",
    description: "Fullstack web development. Incrementally developed company's in house management system. Took part in multiple QR scanning pilot projects. Services are deployed on AWS.",
    hover_class: "hover-turquoise"
  },
  {
    title: "Software Engineer",
    company_name: "Grove Engineering",
    from: "Oct 2019",
    to: "Dec 2020",
    description: "Ported desktop app written in VB6 to the web. Reverse engineered and built web application from scratch due to the non-portability nature of the desktop application. Implemented real-time 3D graphics into the web app with WebGL.",
    hover_class: "hover-peach"
  },
  {
    title: "Junior Software Engineer",
    company_name: "Quantified Intelligence",
    from: "Feb 2018",
    to: "Feb 2019",
    description: "Worked with immediate mode GUIs while developing core components of the AI engine. Promoted to team lead later on.",
    hover_class: "hover-rose"
  }
]);
const skills = reactive([
  {
    title: "Programming Languages",
    description: "Programming languages I am most proficient with.",
    contents: [ "C", "C++", "C#", "JavaScript / TypeScript", "SQL" ],
    hover_class: "hover-ocean"
  },
  {
    title: "Frameworks",
    description: "Frameworks I use at work or in my personal projects.",
    contents: [ "Vulkan", "OpenGL", "VueJs", "ExpressJs", "Redis", "Prisma / Sequelize" ],
    hover_class: "hover-turquoise"
  },
  {
    title: "Core Competencies",
    description: "Domain areas that I excel at.",
    contents: [
      "Graphics Programming",
      "Linear Algebra & 3D Math",
      "Multithreading",
      "Fullstack Web Development",
      "AWS (EC2, RDS, S3, Route 53)"
    ],
    hover_class: "hover-rose"
  }
]);
const games = reactive([
  {
    title: "Total War: Warhammer",
    imgUrl: twWarhammerImgUrl,
    contribution: "Ported to different store fronts. Bug fixes."
  },
  {
    title: "Total War: Warhammer II",
    imgUrl: twWarhammer2ImgUrl,
    contribution: "Ported to different store fronts. Bug fixes."
  },
  {
    title: "Total War: Three Kingdoms",
    imgUrl: tw3KingdomsImgUrl,
    contribution: "Ported to different store fronts. Bug fixes."
  }
]);
const userStore = useUserStore();
const resumeUrl = computed(() => userStore.userProfile?.resume_url || "");
const filename = computed(() => resumeUrl.value.substring(resumeUrl.value.lastIndexOf('/') + 1));
const downloadResume = () => {
  const a = document.createElement('a');
  a.href = resumeUrl.value;
  a.download = filename.value;
  a.target = "_blank";
  a.click();
  a.remove();
};
</script>

<style>
.hover-rose:hover {
  background-color: #FFAB9A;
}
.hover-peach:hover {
  background-color: #FFFC9A;
}
.hover-turquoise:hover {
  background-color: #9AFFA6;
}
.hover-ocean:hover {
  background-color: #9AE6FF;
}
</style>
