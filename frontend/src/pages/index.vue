<template>
  <SectionBody flex flex-col items-start justify-center mb-5>
    <div class="intro-section">
      <div mb-5>
        <Title>Apa Khabar!</Title>
        <Text>This is how we say "How are you?" in Malaysian.</Text>
      </div>
      <Text text-justify>
        I am a software engineer currently part the foundation team at The Creative Assembly. In pursuit of knowledge, I constantly meddle in uncharted territories beyond my skill set. Some areas that I have dwelled in over the past couple of years include desktop application development, low level graphics APIs (i.e OpenGL & Vulkan), web development and much more!
        <br/><br/>
        This site aims to be a space where I showcase my projects and share my knowledge. Feel free to take a look around and enjoy your stay. Disclaimer, opinions expressed are solely my own.
      </Text>
    </div>
  </SectionBody>
  <SectionBody flex flex-col items-start justify-center mb-5>
    <div class="article-section">
      <div mb-5>
        <Title>Articles</Title>
        <Text>Curious about my findings? Browse articles I've written and let me know what you think.</Text>
      </div>
    </div>
  </SectionBody>
  <SectionBody flex flex-col items-start justify-center mb-5>
    <div class="project-section">
      <div mb-5>
        <Title>Projects</Title>
        <Text>Have a look around at what I've done in my spare time over the past few years.</Text>
      </div>
    </div>
  </SectionBody>
</template>

<route>
{
  meta: {
    layout: "default"
  }
}
</route>
